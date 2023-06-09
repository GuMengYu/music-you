<script setup lang="ts">
import { mdiCloudUpload, mdiPlay } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { cloudDiskMusicList, uploadMusicToCloudDisk } from '@/api/cloud'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'
import { bytesToSize } from '@/util/fn'

import CloudList from './list.vue'

const { t } = useI18n()
const player = usePlayer()
const toast = useToast()

const clouds = ref<Track[]>([])
const loading = ref(false)
const upload = ref<HTMLInputElement>()
const UPLOAD_STATE = {
  NORMAL: { text: '等待中', icon: 'normal', val: 'NORMAL', class: 'normal' },
  PENDING: { text: '上传准备中', icon: 'pending', val: 'PENDING', class: 'pending' },
  UPLOADING: { text: '正在上传', icon: 'upload', val: 'UPLOADING', class: 'upload' },
  UPLOADED: { text: '上传完成', icon: 'uploaded', val: 'UPLOADED', class: 'uploaded' },
  CONVERT: { text: '转换中', icon: 'convert', val: 'CONVERT', class: 'convert' },
  FAILED: { text: '上传失败', icon: 'failed', val: 'FAILED', class: 'failed' },
  ALREADY_UPLOADED: { text: '云盘里已存在', icon: 'uploaded', val: 'ALREADY_UPLOADED', class: 'uploaded' },
}
const uploadMusic = reactive({
  visible: false,
  file: null as File | null,
  state: UPLOAD_STATE.NORMAL.val,
  uploading: false,
  uploadedPercent: 0,
  uploadedSize: 0,
})
const playerQueue = usePlayQueueStore()
fetch()
async function fetch() {
  loading.value = true
  try {
    const { data } = await cloudDiskMusicList({ limit: 500, offset: 0 })
    clouds.value = data.map((song) => song.simpleSong)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
useAjaxReloadHook('library', () => {
  // reload
  fetch()
})

const uploadingDisabled = computed(() => {
  return [UPLOAD_STATE.PENDING.val, UPLOAD_STATE.UPLOADING.val, UPLOAD_STATE.CONVERT].includes(uploadMusic.state)
})
function handlePlayCloud() {
  playerQueue.updatePlayQueue(0, 'cloud', '我的云盘', clouds.value)
  player.next()
}
function handleUploadTrack() {
  upload.value?.click()
}
function handleChange(e: Event) {
  const { files } = e.target as HTMLInputElement
  const file = files?.[0]
  if (file) {
    if (file.size > 80 * 1024 * 1024) {
      toast.error(t('message.music_limit'))
      return
    }
    try {
      uploadMusic.visible = true
      uploadMusic.file = file
      uploadMusic.state = UPLOAD_STATE.PENDING.val
      uploadMusicToCloudDisk(uploadMusic.file, {
        timeout: Infinity,
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const { lengthComputable, total, loaded } = progressEvent
          if (lengthComputable) {
            uploadMusic.uploadedSize = loaded
            uploadMusic.uploadedPercent = +((loaded / total) * 100).toFixed(2)
            if (total === loaded) {
              uploadMusic.state = UPLOAD_STATE.CONVERT.val
            }
          }
        },
      }).then((res) => {
        const { data } = res
        if (data.code === 200) {
          uploadMusic.state = UPLOAD_STATE.UPLOADED.val
          fetch()
        } else if (data.code === 201) {
          uploadMusic.state = UPLOAD_STATE.ALREADY_UPLOADED.val
        }
      })
    } catch (e) {
      uploadMusic.state = UPLOAD_STATE.FAILED.val
      console.log(e)
    }
  }
}
function handleCloseUploadModal() {
  upload.value && (upload.value.value = '')
  uploadMusic.visible = false
  uploadMusic.file = null
  uploadMusic.state = UPLOAD_STATE.NORMAL.val
  uploadMusic.uploadedPercent = 0
  uploadMusic.uploadedSize = 0
}
</script>

<template>
  <Col :title="$t('common.cloud_music')" class="mb-4">
    <template #more>
      <div class="d-flex gap-2">
        <v-btn rounded="pill" variant="outlined" color="tertiary" @click="handlePlayCloud">
          <span class="d-flex align-center gap-1">
            <v-icon>{{ mdiPlay }}</v-icon>
            {{ t('common.play_all') }}
          </span>
        </v-btn>
        <v-btn rounded="pill" variant="outlined" color="primary" @click="handleUploadTrack">
          <span class="d-flex align-center gap-1">
            <v-icon>{{ mdiCloudUpload }}</v-icon>
            {{ t('common.upload_music') }}
          </span>
        </v-btn>
        <input v-show="false" ref="upload" type="file" accept="audio/mpeg,audio/flac" @change="handleChange" />
      </div>
    </template>
    <cloud-list :tracks="clouds" @update-list="(list) => (clouds = [...list])" />
    <v-dialog v-model="uploadMusic.visible" persistent class="upload-file-wrapper">
      <v-card outlined color="surface" class="pt-4 align-self-center" rounded="xl" width="90vw" max-width="350">
        <div class="d-flex justify-center">
          <v-icon color="secondary">
            {{ mdiCloudUpload }}
          </v-icon>
        </div>

        <v-card-title class="text-center">{{ UPLOAD_STATE[uploadMusic.state].text }}</v-card-title>
        <v-card-subtitle class="text-center">{{ uploadMusic.file?.name }}</v-card-subtitle>
        <div class="mt-2 px-4">
          <v-progress-linear v-model="uploadMusic.uploadedPercent" rounded color="primary"></v-progress-linear>
          <div class="d-flex text-caption justify-space-between">
            <span>{{ bytesToSize(uploadMusic.uploadedSize) }}</span>
            <span>{{ bytesToSize(uploadMusic.file?.size) }}</span>
          </div>
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="plain" :disabled="uploadingDisabled" @click="handleCloseUploadModal"
            >确定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Col>
</template>
