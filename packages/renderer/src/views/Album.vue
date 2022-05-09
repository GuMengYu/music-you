<template>
  <div class="list">
    <div class="d-flex mb-2">
      <Cover :data="state.album" :no-info="true" type="album" :max-width="225" :min-width="225" class="mr-4" />
      <v-card flat rounded="xl" class="d-flex flex-column pt-4 px-4 flex-fill">
        <div class="d-flex justify-space-between mb-4 align-center">
          <span>
            <v-icon small>{{ mdiAlbum }}</v-icon>
            <span class="text-caption ml-2">Album</span>
          </span>
          <span class="text-caption">
            <span> 共{{ state.album.size }}首 </span> ·
            <span class="primary--text">{{ formatDate(state.album.publishTime) }}</span>
          </span>
        </div>
        <div class="d-flex justify-space-between mb-4 align-center">
          <span class="d-flex align-center">
            <v-icon small>{{ mdiAlbum }}</v-icon>
            <span class="text-h5 ml-2"> {{ state.album.name }} </span>
          </span>
          <v-btn color="primary" size="small" class="onPrimary--text" @click="play">
            <v-icon size="small">{{ mdiPlay }}</v-icon>
            {{ $t('common.play') }}
          </v-btn>
        </div>
        <div class="d-flex mb-4 align-center">
          <v-icon small>{{ mdiAccountMusic }}</v-icon>
          <span class="text-caption ml-2">
            {{ state.album.artist?.name }}
          </span>
        </div>
        <div class="d-flex align-start" @click="state.showMoreDesc = true">
          <v-icon small>{{ mdiInformation }}</v-icon>
          <p class="text-caption h-3x ml-2">
            {{ state.album.description }}
          </p>
        </div>
        <div class="d-flex justify-end align-center" :style="{ marginTop: 'auto' }">
          <v-btn
            size="small"
            variant="outlined"
            class="ml-6"
            :color="state.subscribed ? 'primary' : ''"
            rounded
            @click="subscribe"
          >
            {{ state.subscribed ? '已收藏' : '收藏' }}
          </v-btn>
          <v-btn size="small" color="primary" icon variant="plain" @click="goto">
            <v-icon>
              {{ mdiMapMarkerCircle }}
            </v-icon>
          </v-btn>
        </div>
      </v-card>
    </div>
    <div class="d-flex">
      <div class="mr-4">
        <v-card :width="225" :height="108" flat color="tertiaryContainer" rounded class="album-info text-caption">
          <div class="album-info-item">
            <span class="item-title font-weight-bold">发行年份</span>
            <span class="item-desc">{{ formatDate(state.album.publishTime, 'YYYY') }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">时长</span>
            <span class="item-desc">{{ formatDuring(albumDt) }}</span>
          </div>
          <div class="album-info-item">
            <span class="item-title font-weight-bold">发行公司</span>
            <span class="item-desc h-1x">© {{ state.album['company'] }}</span>
          </div>
        </v-card>
        <common-card class="mt-2" title="Ta的其他热门专辑" rounded="xl" :width="225" color="surfaceVariant">
          <v-list bg-color="surfaceVariant">
            <v-list-item v-for="album in state.relatedAlbum" :key="album.id" class="mb-4" @click="gotoAlbum(album.id)">
              <v-img :src="album.picUrl" width="48" class="rounded-lg mr-2" />
              <v-list-item-title class="text-caption">
                {{ album.name }} {{ formatDate(album.publishTime, 'YYYY') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </common-card>
      </div>

      <common-card class="flex-fill" color="surfaceVariant" title="专辑歌曲">
        <v-list bg-color="surfaceVariant">
          <track-item
            v-for="(track, idx) in state.album.tracks"
            :key="track.id"
            :track="track"
            :index="idx + 1"
            @play="eventBus.emit(track.id)"
          />
        </v-list>
      </common-card>
    </div>
    <v-dialog v-model="state.showMoreDesc" max-width="50vw" scrollable>
      <v-card color="surfaceVariant">
        <v-card-title>专辑简介</v-card-title>
        <v-card-text>
          {{ state.album['description'] }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import { mdiAccountMusic, mdiAlbum, mdiInformation, mdiMapMarkerCircle, mdiPlay } from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import { useIpcRenderer } from '@vueuse/electron'
import dayjs from 'dayjs'
import { computed, reactive, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import { getAlbum, getAlbumDynamic, getArtistAlbum } from '@/api'
import { sub } from '@/api/music'
import CommonCard from '@/components/app/CommonCard.vue'
import Cover from '@/components/app/cover/Cover.vue'
import TrackItem from '@/components/app/TrackItem.vue'
import { usePlayer } from '@/player/player'
import { formatDuring, isElectron } from '@/util/fn'

const player = usePlayer()
const router = useRouter()

const props = defineProps({
  id: {
    type: [String, Number],
    default: '',
  },
})
const state = reactive({
  album: {},
  relatedAlbum: [],
  loading: true,
  subscribed: false,
  showMoreDesc: false,
})

const albumDt = computed(() => {
  return state.album?.tracks?.reduce((p, c) => p + c['dt'], 0)
})

watchEffect(() => {
  fetch(props.id)
})
async function fetch(id: number | string) {
  state.loading = true
  state.album = {}
  const { album = {}, songs } = await getAlbum(id)
  const { isSub } = await getAlbumDynamic(id)

  if (album?.artist.id) {
    const { hotAlbums = [] } = await getArtistAlbum(album.artist.id, 6)
    state.relatedAlbum = hotAlbums.filter((i) => i.id !== album.id)
  }
  state.album = album
  state.album.tracks = songs
  state.subscribed = isSub
  state.loading = false
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
const eventBus = useEventBus<string>('addToQueue')

function goto() {
  const url = `https://music.163.com/#/album?id=${state.album.id}`
  if (isElectron()) {
    const ipcRenderer = useIpcRenderer()
    ipcRenderer.invoke('open-url', url)
  } else {
    window.open(url, '_blank')
  }
}
function gotoAlbum(id: number) {
  router.push(`/album/${id}`)
}
async function subscribe() {
  const { id } = state.album
  const { code, message } = await sub('album', id, state.subscribed ? 0 : 1)
  if (code === 200) {
    state.subscribed = !this.subscribed
  } else {
    console.log('subscribe error', message)
  }
}
function formatDate(date: number | string, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}
</script>
<style lang="scss" scoped>
.list {
  position: relative;
  .album-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    .album-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title {
        min-width: 80px;
      }
    }
  }
  .virtual-scroll-container {
    min-height: 350px;
  }
}
</style>
