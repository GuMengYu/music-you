<script lang="ts" setup>
// coding here
import {
  mdiAlbum,
  mdiArrowRight,
  mdiBookmarkPlusOutline,
  mdiBookmarkRemoveOutline,
  mdiClose,
  mdiCopyright,
  mdiFilterVariant,
  mdiImage,
  mdiPlayOutline,
} from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { sub } from '@/api/music'
import PinBtn from '@/components/button/PinBtn.vue'
import { useDownload } from '@/hooks/useDownload'
import { usePlayer } from '@/player/player'
import dayjs from '@/plugins/dayjs'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Album } from '@/types'
import { formatDuring, sizeOfImage } from '@/util/fn'
import { mdiNetEase } from '@/util/icons'
import is from '@/util/is'

const { t } = useI18n()
const toast = useToast()
const player = usePlayer()
const playQueue = usePlayQueueStore()
const { smAndUp } = useDisplay()

const loading = ref(false)
const subscribed = ref(false)
const showMoreDesc = ref(false)
const playLoading = ref(false)

const props = defineProps<{
  album: Album
}>()

const albumDt = computed(() => {
  return props.album?.tracks?.reduce((p, c: any) => p + c.dt, 0)
})

async function play() {
  playLoading.value = true

  playQueue.updatePlayQueue(props.album.id, 'album', props.album.name, props.album.tracks)
  player.next()
  setTimeout(() => {
    playLoading.value = false
  }, 1000)
}

function goto() {
  const url = `https://music.163.com/#/album?id=${props.album.id}`
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}

async function subscribe() {
  const { id } = props.album
  const { code, message } = await sub('album', id, subscribed.value ? 0 : 1)
  if (code === 200) {
    subscribed.value = !subscribed.value
    toast.success(t('message.sub_msg', subscribed.value ? 1 : 2))
  } else {
    toast.error(message)
  }
}
function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

function saveCover() {
  const url = props.album.picUrl
  useDownload(url)
}
</script>
<template>
  <div class="d-flex flex-column gap-6">
    <div class="drag-area d-flex mx-n4 mt-n5" :class="smAndUp ? '' : 'flex-column'">
      <v-img
        :src="album['picUrl']"
        cover
        :aspect-ratio="28 / 9"
        :gradient="`90deg, rgba(var(--v-theme-surface), 1) 0%, rgb(0 0 0 / 0%) 50%, rgba(var(--v-theme-surface), 0.7) 100%`"
      >
        <div
          class="d-flex flex-column gap-2 h-100"
          :class="smAndUp ? 'order-1' : 'order-2'"
          :style="{
            background: 'linear-gradient(360deg, rgba(var(--v-theme-surface), 1) 0%,rgba(0,0,0,0) 100%)',
          }"
        >
          <back-btn class="align-self-start mb-auto mx-4 mt-4" variant="tonal" color="primary" />
          <div class="no-drag-area">
            <div class="d-flex flex-column gap-2 mx-6 mb-2">
              <span
                class="text-h4 text-lg-h3 text-xl-h3 text-xxl-h2 font-weight-medium line-clamp-2 select-text"
                :class="{
                  'pr-6': smAndUp,
                  'text-center': !smAndUp,
                }"
                >{{ album.name }}</span
              >
              <div class="d-flex flex-column">
                <div class="d-flex align-center text-body-1 font-weight-medium">
                  <artists-link v-if="album['artist']" color="primary" :artists="[album['artist']]" />
                </div>
                <span class="text-caption text-disabled">
                  {{ formatDate(album['publishTime'], 'LL') }}
                </span>
              </div>
              <div class="d-flex py-2" :class="{ 'justify-center': !smAndUp }">
                <div class="d-flex flex-column align-center pr-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ album['size'] }}</span>
                  <span class="text-disabled text-caption"> 首 </span>
                </div>
                <v-divider class="my-2" vertical />
                <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">
                    <v-icon size="small">{{ mdiAlbum }} </v-icon>
                  </span>
                  <span class="text-disabled text-caption">专辑</span>
                </div>
                <v-divider class="my-2" vertical />

                <div class="d-flex flex-column align-center px-4" :style="{ minWidth: '96px' }">
                  <span class="text-body-1 font-weight-medium">{{ formatDuring(albumDt) }}</span>
                  <span class="text-disabled text-caption">时长</span>
                </div>
                <template v-if="album['company']">
                  <v-divider class="my-2" vertical />
                  <div class="d-flex flex-column align-center pl-4" :style="{ minWidth: '96px' }">
                    <span class="text-body-1 font-weight-medium">
                      <v-icon size="small">{{ mdiCopyright }} </v-icon>
                    </span>
                    <span class="text-disabled text-caption">{{ album['company'] }}</span>
                  </div>
                </template>
              </div>
              <div class="d-flex align-center">
                <v-btn
                  size="large"
                  class="mr-4 px-10 rounded-pill"
                  variant="tonal"
                  color="primary"
                  :loading="playLoading as boolean"
                  @click="play"
                >
                  <v-icon size="large">{{ mdiPlayOutline }}</v-icon>
                </v-btn>
                <v-btn class="mr-4" icon color="secondary" variant="tonal" @click="subscribe">
                  <v-icon>
                    {{ subscribed ? mdiBookmarkRemoveOutline : mdiBookmarkPlusOutline }}
                  </v-icon>
                  <v-tooltip activator="parent" location="top">
                    {{ t('common.collection', subscribed ? 2 : 1) }}
                  </v-tooltip>
                </v-btn>
                <v-btn class="mr-4" icon variant="tonal" color="tertiary" @click="goto">
                  <v-icon>
                    {{ mdiNetEase }}
                  </v-icon>
                </v-btn>
                <v-btn class="mr-4" icon variant="tonal" color="primary" @click="saveCover">
                  <v-icon>{{ mdiImage }} </v-icon>
                  <v-tooltip activator="parent" location="top"> save cover </v-tooltip>
                </v-btn>
                <pin-btn :data="album" type="album" />
              </div>
            </div>
          </div>
        </div>
      </v-img>
    </div>
    <div v-if="album['description']" class="d-flex flex-column mx-2">
      <div class="d-flex align-center">
        <span class="font-weight-medium mr-2 text-h6">{{ t('main.album.about') }}</span>
        <v-btn icon variant="text" @click="showMoreDesc = true">
          <v-icon>{{ mdiArrowRight }}</v-icon>
        </v-btn>
      </div>
      <p class="text-caption line-clamp-5 select-text">
        {{ album['description'] }}
      </p>
    </div>
    <div class="d-flex flex-column mx-2">
      <div class="d-flex align-center">
        <span class="font-weight-medium mr-2 text-h6">{{ t('main.album.inner') }}</span>
        <v-btn icon variant="text">
          <v-icon>{{ mdiFilterVariant }}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-dialog v-model="showMoreDesc" :scrollable="true">
      <v-card color="surfaceVariant" width="90vw" max-width="450" rounded="xl" class="pb-4 align-self-center">
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            {{ t('main.album.desc') }}
            <v-btn icon variant="text" @click="showMoreDesc = false"
              ><v-icon>{{ mdiClose }}</v-icon></v-btn
            >
          </div>
        </v-card-title>
        <v-card-text>
          {{ album['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
