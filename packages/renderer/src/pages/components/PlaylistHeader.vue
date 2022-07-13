<script lang="ts" setup>
// coding here
import {
  mdiAccountMusic,
  mdiDeleteAlert,
  mdiImage,
  mdiInformation,
  mdiLockOutline,
  mdiMap,
  mdiPlaylistEdit,
  mdiPlaylistMusicOutline,
} from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { sub } from '@/api/music'
import { deletePlayList, updatePlaylist } from '@/api/playlist'
import useDonwload from '@/hooks/useDownload'
import { usePlayer } from '@/player/player'
import dayjs from '@/plugins/dayjs'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { Playlist } from '@/types'
import { downloadFile, formatDuring, formatNumber } from '@/util/fn'
import is from '@/util/is'
import { specialType } from '@/util/metadata'
const { t } = useI18n()
const toast = useToast()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const subscribed = ref(false)
const isDelete = ref(false)
const showDeleteAlert = ref(false)
const showMoreDesc = ref(false)
const showEdit = ref(false)
const userStore = useUserStore()

const props = defineProps<{
  playlist: Playlist
}>()

const editForm = reactive({
  title: '',
  description: '',
  tags: [] as string[],
})

const tracksDt = computed(() => {
  return props.playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)
})

const createdBySelf = computed(() => {
  return userStore.account?.profile.userId === props.playlist.creator?.userId
})

// 特殊歌单“喜欢的音乐”
const isMyFavPlayList = computed(() => {
  return props.playlist.specialType === specialType.fav.type
})
const official = computed(() => {
  return !!props.playlist.officialPlaylistType
})

watchEffect(() => {
  subscribed.value = props.playlist.subscribed
})
async function play() {
  if (props.playlist) {
    playQueueStore.updatePlayQueue(props.playlist.id, 'playlist', props.playlist.name, props.playlist.tracks)
    player.next()
  }
}

async function subscribe() {
  const { id } = props.playlist
  const { code, message } = await sub('playlist', id, subscribed.value ? 0 : 1)
  if (code === 200) {
    subscribed.value = !subscribed.value
    toast.success(t('message.sub_msg', subscribed.value ? 1 : 2))
  } else {
    toast.error(message)
  }
}
async function del() {
  const { code, message } = await deletePlayList(+props.playlist.id)
  if (code === 200) {
    toast.success(t('message.delete_list', 2))
    isDelete.value = true
    showDeleteAlert.value = false
  } else {
    toast.error(message)
  }
}

async function edit() {
  const { code } = await updatePlaylist(props.playlist.id, editForm.title, editForm.description, editForm.tags)
  if (code === 200) {
    showEdit.value = false
    // state.playlist.description = editForm.description
    // state.playlist.tags = editForm.tags
    // state.playlist.name = editForm.title
  }
  // fetch(+props.id, true)
}

function cancel() {
  reset()
  showEdit.value = false
}
const reset = () => {
  editForm.title = props.playlist.name
  editForm.description = props.playlist.description
  editForm.tags = props.playlist.tags ?? []
}

function goto() {
  const url = `https://music.163.com/#/playlist?id=${props.playlist.id}`
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}

function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

function saveCover() {
  const url = props.playlist.picUrl ?? props.playlist.coverImgUrl
  useDonwload(url)
}
</script>
<template>
  <div class="d-flex gap-4">
    <Cover :data="playlist" :no-info="true" type="playlist" :max-width="225" :min-width="225" class="mr-4">
      <template #action>
        <v-btn icon variant="flat" color="primary" @click="saveCover">
          <v-icon color="onPrimary">{{ mdiImage }} </v-icon>
          <v-tooltip activator="parent" location="top"> 保存封面 </v-tooltip>
        </v-btn>
      </template>
    </Cover>
    <v-card color="surfaceVariant" flat rounded="lg" class="d-flex flex-column pa-4 flex-fill gap-2">
      <div class="d-flex justify-space-between align-center">
        <span class="d-flex align-center">
          <v-icon size="small">{{ playlist.privacy ? mdiLockOutline : mdiPlaylistMusicOutline }}</v-icon>
          <span class="text-caption ml-2 text-primary">{{
            $t(`main.${playlist.privacy ? 'p_playlists' : 'playlists'}`)
          }}</span>
        </span>
        <span class="text-caption">
          <span> {{ $t('common.track_size', [playlist.trackCount]) }} </span> ·
          <span class="text-primary">{{ formatDate(playlist.createTime, 'YYYY') }}</span> ·
          <span>{{ $t('common.duration_total', [formatDuring(tracksDt)]) }}</span> ·
          <span class="text-primary">{{ $t('common.play_count', [formatNumber(playlist.playCount)]) }}</span>
        </span>
      </div>
      <div class="d-flex justify-space-between align-center">
        <span class="d-flex align-center">
          <v-icon size="small">{{ mdiPlaylistMusicOutline }}</v-icon>
          <span class="text-h5 mx-2 line-clamp-1">
            {{ playlist.name }}
          </span>
        </span>
        <v-btn size="small" color="primary" variant="flat" rounded class="px-5" @click="play">
          {{ $t('common.play') }}
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <v-icon size="small">{{ mdiAccountMusic }}</v-icon>
        <span class="text-caption ml-2">
          {{ playlist.creator?.nickname }}
        </span>
      </div>
      <div v-if="playlist.description" class="d-flex align-start" @click="showMoreDesc = true">
        <v-icon size="small" class="flex-shrink-0">{{ mdiInformation }}</v-icon>
        <p class="text-caption line-clamp-2 ml-2">
          {{ playlist.description }}
        </p>
      </div>
      <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
        <v-square-btn size="small" color="primary" class="mr-2" @click="goto">
          <v-icon>
            {{ mdiMap }}
          </v-icon>
        </v-square-btn>
        <template v-if="createdBySelf && !isMyFavPlayList">
          <v-square-btn size="small" class="mr-2" color="primary" @click="showEdit = true">
            <v-icon>
              {{ mdiPlaylistEdit }}
            </v-icon>
          </v-square-btn>
          <v-dialog v-model="showDeleteAlert" persistent max-width="350">
            <template #activator="{ props: dialogProps }">
              <v-btn
                color="primary"
                size="small"
                v-bind="dialogProps"
                variant="outlined"
                class="mr-2"
                :disabled="isDelete"
              >
                {{ $tc('message.delete_list', isDelete ? 2 : 1) }}
              </v-btn>
            </template>
            <v-card class="pt-4 pb-2" rounded="xl" color="surface">
              <div class="d-flex justify-center">
                <v-icon color="secondary">
                  {{ mdiDeleteAlert }}
                </v-icon>
              </div>
              <v-card-title class="text-center">{{ $tc('message.delete_list', 1) }}</v-card-title>
              <v-card-subtitle class="text-center">{{ $t('message.delete_list_alert') }}</v-card-subtitle>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="plain" @click="showDeleteAlert = false">
                  {{ $t('common.disagree') }}
                </v-btn>
                <v-btn color="primary" variant="plain" @click="del"> {{ $t('common.agree') }} </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <v-btn v-else-if="!isMyFavPlayList" size="small" variant="outlined" color="primary" @click="subscribe">
          {{ $tc('common.collect', subscribed ? 2 : 1) }}
        </v-btn>
      </div>
    </v-card>
    <v-dialog v-model="showEdit" :scrollable="true">
      <v-card width="420" min-height="300" rounded="xl" class="py-2">
        <v-card-title> {{ $t('main.playlist.edit') }} </v-card-title>
        <v-card-text>
          <v-text-field v-model="editForm.title" variant="outlined" :label="$t('main.playlist.name')"> </v-text-field>
          <v-textarea v-model="editForm.description" hide-details variant="outlined" :label="$t('main.playlist.desc')">
          </v-textarea>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" variant="plain" plain @click="cancel"> {{ $t('common.cancel') }} </v-btn>
          <v-btn color="primary" variant="plain" plain @click="edit"> {{ $t('common.confirm') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showMoreDesc" :scrollable="true">
      <v-card color="surfaceVariant" width="420" rounded="xl" class="py-4">
        <v-card-title>{{ $t('main.playlist.desc') }}</v-card-title>
        <v-card-text>
          {{ playlist['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
/* scoped css */
</style>
