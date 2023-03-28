<template>
  <Col :title="t('common.recent')">
    <v-btn-toggle v-model="current" color="primary" variant="text">
      <v-btn v-for="tab in tabs" :key="tab.key" rounded="md" :value="tab.key" class="mx-1 px-6">
        {{ tab.name }}
      </v-btn>
    </v-btn-toggle>
    <v-window :model-value="current" class="mt-4">
      <v-window-item :value="TYPES.TRACK">
        <div class="d-flex w-100 justify-end">
          <v-btn rounded="pill" variant="outlined" color="tertiary" @click="playAll">
            <span class="d-flex align-center gap-1">
              <v-icon>{{ mdiPlay }}</v-icon>
              {{ t('common.play_all') }}
            </span>
          </v-btn>
        </div>
        <track-list type="daily" :tracks="tracks" />
      </v-window-item>
      <v-window-item :value="TYPES.PLAYLIST">
        <card-row>
          <cover v-for="item in data.playlist" :key="item.data.id" :data="item.data" type="playlist" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.ALBUM">
        <card-row>
          <cover v-for="album in data.albums" :key="album.data.id" :data="album.data" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.VIDEO">
        <card-row>
          <video-cover v-for="mv in data.videos" :key="mv.data.id" :data="mv.data" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.PODCAST">
        <card-row> 👷施工中... </card-row>
      </v-window-item>
    </v-window>
  </Col>
</template>
<script lang="ts" setup>
import { mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

import { recent } from '@/api/user'
import TrackList from '@/components/track/TrackList.vue'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { Album, MV, Playlist, Track } from '@/types'

const { t } = useI18n()

const route = useRoute()
const player = usePlayer()
const playerQueue = usePlayQueueStore()
const userStore = useUserStore()
const toast = useToast()
const { playlists, uid } = storeToRefs(userStore)

enum TYPES {
  TRACK = 'track',
  VIDEO = 'video',
  PLAYLIST = 'playlist',
  ALBUM = 'album',
  PODCAST = 'podcast',
}
const tabs = computed(() => {
  return [
    { key: TYPES.TRACK, name: '歌曲' },
    { key: TYPES.PLAYLIST, name: '歌单' },
    { key: TYPES.ALBUM, name: '专辑' },
    // { key: TYPES.VIDEO, name: '视频' },
    // { key: TYPES.PODCAST, name: '播客' },
  ]
})
const current = ref(TYPES.PLAYLIST)
const data: {
  playlist: {
    data: Playlist
  }[]
  albums: {
    data: Album
  }[]
  tracks: {
    data: Track
  }[]
  videos: {
    data: MV
  }[]
  podcasts: {
    data: Album
  }[]
} = reactive({
  playlist: [],
  albums: [],
  tracks: [],
  videos: [],
  podcasts: [],
})
const tracks = computed<Track[]>(() => {
  return data.tracks.map((i) => i.data)
})
const loading = ref(false)
fetch()
useAjaxReloadHook('recent', () => {
  // reload
  fetch()
})
async function fetch() {
  current.value = TYPES.TRACK
  loading.value = true
  try {
    const [{ data: track }, { data: video }, { data: playlist }, { data: album }, { data: podcast }] =
      await Promise.all([
        recent(),
        recent(void 0, 'video'),
        recent(void 0, 'playlist'),
        recent(void 0, 'album'),
        recent(void 0, 'dj'),
      ])
    data.tracks = track.list
    data.videos = video.list
    data.playlist = playlist.list
    data.albums = album.list
    data.podcasts = podcast.list
  } catch (e) {
    toast.error('something wrong')
  } finally {
    loading.value = false
  }
}

function playAll() {
  playerQueue.updatePlayQueue(0, 'recent', t('common.recent'), tracks.value)
  player.next()
}
onActivated(() => {
  const tab = route.params.tab as TYPES
  if (tab) {
    current.value = tab
  }
})
</script>
