<template>
  <div>
    <!-- <Col title="最近播放" subtitle="activity" class="mb-4">
      <card-row :grid-type="GridType.C">
        <track-item
          v-for="(track, idx) in state.recently"
          :key="track['resourceId']"
          :track="track.data"
          :index="idx + 1"
          from="album"
        />
      </card-row>
    </Col> -->
    <v-tabs v-model="current" class="mb-4">
      <v-tab v-for="tab in tabs" :key="tab.key" :value="tab.key" class="font-weight-bold">
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-window :model-value="current" class="tab_page">
      <v-window-item :value="TYPES.PLAYLIST">
        <card-row>
          <cover v-for="item in playlists" :key="item.id" :data="item" type="playlist" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.ALBUM">
        <card-row>
          <div v-for="album in data.albums" :key="album.id">
            <cover :data="album" />
          </div>
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.ARTIST">
        <card-row>
          <artists-cover v-for="artist in data.artists" :key="artist.id" :artist="artist" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.MV">
        <card-row>
          <video-cover v-for="mv in data.mvs" :key="mv.id" :data="mv" />
        </card-row>
      </v-window-item>
      <v-window-item :value="TYPES.CLOUD">
        <!-- <div class="d-flex justify-end">
          <v-btn size="small" color="primary">
            <v-icon>
              {{ mdiPlay }}
            </v-icon>
            {{ $t('common.play') }}
          </v-btn>
        </div> -->

        <v-list>
          <TrackItem
            v-for="(track, index) in data.clouds"
            :key="track.id"
            :track="track"
            :index="index + 1"
          ></TrackItem>
        </v-list>
      </v-window-item>
    </v-window>
  </div>
</template>
<script lang="ts" setup>
import { mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import { cloudDiskMusicList } from '@/api/cloud'
import { favAlbums, favArtists, favMVs, recent } from '@/api/user'
import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Track } from '@/types'

const { t } = useI18n()

const userStore = useUserStore()

const { playlists } = storeToRefs(userStore)
enum TYPES {
  PLAYLIST = 'playlist',
  ALBUM = 'album',
  ARTIST = 'artist',
  MV = 'mv',
  CLOUD = 'cloud',
}
const tabs = [
  { key: TYPES.PLAYLIST, name: t('main.playlists') },
  { key: TYPES.ALBUM, name: t('main.albums') },
  { key: TYPES.ARTIST, name: t('main.artists') },
  { key: TYPES.MV, name: t('main.mvs') },
  { key: TYPES.CLOUD, name: t('main.disk') },
]
const current = ref(TYPES.PLAYLIST)
const data: {
  albums: Album[]
  artists: Artist[]
  mvs: MV[]
  clouds: Track[]
} = reactive({
  albums: [],
  artists: [],
  mvs: [],
  clouds: [],
})
const tabLoading = reactive({
  album: false,
  artist: false,
  mv: false,
  cloud: false,
})

watch(current, () => {
  console.log('tabs.value.current', current.value)
  loadData()
})
async function loadData() {
  console.log(current.value)
  if (current.value === TYPES.ALBUM && !data.albums.length) {
    tabLoading[current.value] = true
    const { data: albums } = await favAlbums()
    data.albums = albums
    tabLoading[current.value] = false
  } else if (current.value === TYPES.ARTIST && !data.artists.length) {
    tabLoading[current.value] = true
    const { data: artists } = await favArtists()
    data.artists = artists
    tabLoading[current.value] = false
  } else if (current.value === TYPES.MV && !data.mvs.length) {
    tabLoading[current.value] = true
    const { data: mvs } = await favMVs()
    data.mvs = mvs
    tabLoading[current.value] = false
  } else if (current.value === TYPES.CLOUD && !data.clouds.length) {
    tabLoading[current.value] = true
    const { data: clouds } = await cloudDiskMusicList()
    data.clouds = clouds.map((song) => song.simpleSong)
    tabLoading[current.value] = false
  }
}
</script>
