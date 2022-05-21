<template>
  <div>
    <v-tabs v-model="current" class="mb-4" dense>
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
          <cover v-for="album in data.albums" :key="album.id" :data="album" />
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
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { cloudDiskMusicList } from '@/api/cloud'
import { favAlbums, favArtists, favMVs, recent } from '@/api/user'
import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Track } from '@/types'
const { t } = useI18n()

const userStore = useUserStore()
const toast = useToast()
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
const loading = ref(false)
loadData()
async function loadData() {
  loading.value = true
  try {
    const [{ data: albums }, { data: artists }, { data: mvs }, { data: clouds }] = await Promise.all([
      favAlbums(),
      favArtists(),
      favMVs(),
      cloudDiskMusicList(),
    ])
    data.albums = albums
    data.artists = artists
    data.mvs = mvs
    data.clouds = clouds.map((song) => song.simpleSong)
  } catch (e) {
    toast.error('something wrong')
  } finally {
    loading.value = false
  }
}
</script>
