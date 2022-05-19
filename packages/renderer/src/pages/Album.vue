<script setup lang="ts">
import { mdiAccountMusic, mdiAlbum, mdiClockOutline, mdiInformation, mdiPlay } from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import { useIpcRenderer } from '@vueuse/electron'
import dayjs from 'dayjs'
import { computed, reactive, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

import { getAlbum, getAlbumDynamic } from '@/api/album'
import { getArtistAlbum } from '@/api/artist'
import { sub } from '@/api/music'
import { usePlayer } from '@/player/player'
import type { Album } from '@/types'
import { formatDuring, isElectron, sizeOfImage } from '@/util/fn'
const toast = useToast()
const player = usePlayer()

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
  player.updateTracks(
    {
      list: state.album.tracks,
      id: state.album.id,
    },
    true
  )
}
const eventBus = useEventBus<number>('addToQueue')

function goto() {
  const url = `https://music.163.com/#/album?id=${state.album.id}`
  if (isElectron()) {
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
    toast.info(subscribed.value ? '收藏成功' : '已取消收藏')
  } else {
    toast.error(message)
  }
}
function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
</script>
<template>
  <v-progress-linear v-if="loading" :active="loading" :indeterminate="loading" color="primary"></v-progress-linear>
  <section v-else class="list d-flex flex-column gap-6">
    <div class="d-flex gap-4">
      <Cover :data="state.album" :no-info="true" type="album" :max-width="225" :min-width="225" />
      <v-card color="surfaceVariant" flat rounded="lg" class="d-flex flex-column pa-4 flex-fill gap-2">
        <div class="d-flex justify-space-between align-center">
          <span>
            <v-icon size="small">{{ mdiAlbum }}</v-icon>
            <span class="text-caption ml-2">Album</span>
          </span>
          <span class="text-caption">
            <span> 共{{ state.album.size }}首 </span> ·
            <span class="text-primary">{{ formatDate(state.album.publishTime) }}</span>
            ·
            <span>总时长 {{ formatDuring(albumDt) }}</span>
          </span>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span class="d-flex align-center">
            <v-icon size="small">{{ mdiAlbum }}</v-icon>
            <span class="text-h5 mx-2 h-1x"> {{ state.album.name }} </span>
          </span>
          <v-btn color="primary" size="small" class="onPrimary--text" @click="play">
            <v-icon size="small">{{ mdiPlay }}</v-icon>
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
          <p class="text-caption h-2x ml-2">
            {{ state.album.description }}
          </p>
        </div>
        <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
          <v-btn size="small" variant="outlined" class="mr-2" :color="subscribed ? 'primary' : ''" @click="subscribe">
            {{ subscribed ? '已收藏' : '收藏' }}
          </v-btn>
          <v-btn variant="outlined" size="small" color="primary" @click="goto"> 转到专辑详细 </v-btn>
        </div>
      </v-card>
    </div>
    <v-list class="flex-fill rounded-xl">
      <div class="list-header px-2 text-caption grey--text">
        <span class="d-flex justify-center">#</span>
        <span>标题</span>
        <span class="d-flex justify-end align-center mr-16"
          ><v-icon small> {{ mdiClockOutline }}</v-icon></span
        >
      </div>
      <v-divider class="ma-4" />
      <track-item
        v-for="(track, idx) in state.album.tracks"
        :key="track.id"
        :track="track"
        :index="idx + 1"
        @play="eventBus.emit(track.id)"
      />
    </v-list>
    <Col title="Ta的其他热门专辑">
      <CardRow>
        <cover v-for="album in state.relatedAlbum" :key="album.id" :data="album"></cover>
      </CardRow>
    </Col>
    <v-dialog v-model="showMoreDesc" max-width="50vw" scrollable>
      <v-card color="surfaceVariant">
        <v-card-title>专辑简介</v-card-title>
        <v-card-text>
          {{ state.album['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </section>
</template>
<style lang="scss" scoped>
.list {
  position: relative;
  .list-header {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: [index] 40px [first] 4fr [last] minmax(100px, 1fr);
  }
}
</style>
