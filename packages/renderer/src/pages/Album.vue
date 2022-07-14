<script setup lang="ts">
import { mdiAccountMusic, mdiAlbum, mdiImage, mdiInformation, mdiMap } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { computed, reactive, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { getAlbum, getAlbumDynamic } from '@/api/album'
import { getArtistAlbum } from '@/api/artist'
import { sub } from '@/api/music'
import useDonwload from '@/hooks/useDownload'
import { usePlayer } from '@/player/player'
import dayjs from '@/plugins/dayjs'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Album } from '@/types'
import { formatDuring, sizeOfImage } from '@/util/fn'
import is from '@/util/is'

const { t } = useI18n()
const toast = useToast()
const player = usePlayer()
const playQueue = usePlayQueueStore()
const { smAndUp } = useDisplay()
const props = defineProps<{
  id: number | string
}>()

const loading = ref(false)
const subscribed = ref(false)
const showMoreDesc = ref(false)

interface RootState {
  album: Album
  relatedAlbum: Album[]
}
const state: RootState = reactive({
  album: {} as any,
  relatedAlbum: [] as any,
})

const albumDt = computed(() => {
  return state.album?.tracks?.reduce((p, c: any) => p + c.dt, 0)
})

watchEffect(() => {
  props.id && fetch(+props.id)
})
async function fetch(id: number) {
  loading.value = true
  const { album, songs } = await getAlbum(id)
  const { isSub } = await getAlbumDynamic(id)

  if (album?.artist.id) {
    const { hotAlbums = [] } = await getArtistAlbum(album.artist.id, 6)
    state.relatedAlbum = hotAlbums.filter((i) => i.id !== album.id)
  }
  state.album = album
  state.album.tracks = songs
  subscribed.value = isSub
  loading.value = false
}
async function play() {
  playQueue.updatePlayQueue(state.album.id, 'album', state.album.name, state.album.tracks)
  player.next()
}

function goto() {
  const url = `https://music.163.com/#/album?id=${state.album.id}`
  if (is.electron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}

async function subscribe() {
  const { id } = state.album
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
  const url = state.album.picUrl
  useDonwload(url)
}
</script>
<template>
  <section>
    <list-loader v-if="loading" />
    <div v-else class="list d-flex flex-column gap-4">
      <div class="d-flex gap-4" :class="smAndUp ? '' : 'flex-column align-center'">
        <Cover :data="state.album" :no-info="true" type="album" :max-width="225" :min-width="225">
          <template #action>
            <v-btn icon variant="flat" color="primary" @click="saveCover">
              <v-icon color="onPrimary">{{ mdiImage }} </v-icon>
              <v-tooltip activator="parent" location="top"> 保存封面 </v-tooltip>
            </v-btn>
          </template>
        </Cover>
        <v-card v-if="smAndUp" color="surfaceVariant" flat rounded="lg" class="d-flex flex-column pa-4 flex-fill gap-2">
          <div class="d-flex justify-space-between align-center">
            <span>
              <v-icon size="small">{{ mdiAlbum }}</v-icon>
              <span class="text-caption ml-2">Album</span>
            </span>
            <span class="text-caption">
              <span> {{ $t('common.track_size', [state.album.size]) }} </span> ·
              <span class="text-primary">{{ formatDate(state.album.publishTime, 'YYYY') }}</span>
              ·
              <span>{{ $t('common.duration_total', [formatDuring(albumDt)]) }}</span>
            </span>
          </div>
          <div class="d-flex justify-space-between align-center">
            <span class="d-flex align-center">
              <v-icon size="small">{{ mdiAlbum }}</v-icon>
              <span class="text-h5 mx-2 line-clamp-1"> {{ state.album.name }} </span>
            </span>
            <v-btn size="small" color="primary" variant="flat" rounded class="px-5" @click="play">
              {{ $t('common.play') }}
            </v-btn>
          </div>
          <div class="d-flex align-center">
            <v-icon size="small">{{ mdiAccountMusic }}</v-icon>
            <v-avatar v-if="state.album.artist?.img1v1Url" size="24" class="mx-2">
              <v-img :src="sizeOfImage(state.album.artist?.img1v1Url, 128)" />
            </v-avatar>
            <artists-link v-if="state.album.artist" :artists="[state.album.artist]" />
          </div>
          <div class="d-flex align-start" @click="showMoreDesc = true">
            <v-icon size="small" class="flex-shrink-0">{{ mdiInformation }}</v-icon>
            <p class="text-caption line-clamp-2 ml-2">
              {{ state.album.description }}
            </p>
          </div>
          <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
            <v-square-btn size="small" color="primary" class="mr-2" @click="goto">
              <v-icon>
                {{ mdiMap }}
              </v-icon>
            </v-square-btn>
            <v-btn size="small" variant="outlined" :color="subscribed ? 'primary' : ''" @click="subscribe">
              {{ $tc('common.collect', subscribed ? 2 : 1) }}
            </v-btn>
          </div>
        </v-card>
        <div v-else class="d-flex justify-space-between align-center">
          <span class="d-flex align-center">
            <span class="text-h5 mx-2 line-clamp-1">
              {{ state.album.name }}
            </span>
          </span>
        </div>
      </div>
      <track-list type="album" :tracks="state.album.tracks" :header="smAndUp"></track-list>
      <div class="d-flex flex-column">
        <span class="text-caption"> {{ $t('common.released', [formatDate(state.album.publishTime, 'LL')]) }} </span>
        <span v-if="state.album.company" class="text-caption"> © {{ state.album.company }} </span>
      </div>
      <v-divider />
      <Col :title="$t('main.album.simi')">
        <CardRow>
          <cover v-for="album in state.relatedAlbum" :key="album.id" :data="album"></cover>
        </CardRow>
      </Col>
      <v-dialog v-model="showMoreDesc" scrollable>
        <v-card rounded="xl" color="surfaceVariant" class="py-4" width="90vw" max-width="450">
          <v-card-title>{{ $t('main.album.desc') }}</v-card-title>
          <v-card-text>
            {{ state.album['description'] }}
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </section>
</template>
