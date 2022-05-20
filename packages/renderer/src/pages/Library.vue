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
    <v-tabs v-model="state.tab" class="mb-4">
      <v-tab v-for="tab in state.tabs" :key="tab.key" class="font-weight-bold" @click="loadData">
        {{ tab.name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="state.tab" class="tab_page">
      <v-window-item>
        <card-row>
          <cover v-for="item in playlists" :key="item.id" :data="item" type="playlist" />
        </card-row>
      </v-window-item>
      <v-window-item>
        <card-row>
          <div v-for="album in state.albums" :key="album.id">
            <cover :data="album" />
          </div>
        </card-row>
      </v-window-item>
      <v-window-item>
        <card-row>
          <artists-cover v-for="artist in state.artists" :key="artist.id" :artist="artist" />
        </card-row>
      </v-window-item>
      <v-window-item>
        <card-row>
          <video-cover v-for="mv in state.mvs" :key="mv.id" :data="mv" />
        </card-row>
      </v-window-item>
      <v-window-item>
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
            v-for="(track, index) in state.clouds"
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
import { computed, nextTick, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { cloudDiskMusicList } from '@/api/cloud'
import { favAlbums, favArtists, favMVs, recent } from '@/api/user'
import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Track } from '@/types'

const { t } = useI18n()

const userStore = useUserStore()

const { playlists } = storeToRefs(userStore)
const state = reactive({
  tabs: [
    { key: 'playlists', name: t('main.playlists') },
    { key: 'albums', name: t('main.albums') },
    { key: 'artists', name: t('main.artists') },
    { key: 'mvs', name: t('main.mvs') },
    { key: 'clouds', name: t('main.disk') },
  ],
  tab: 0,
  albums: [] as Album[],
  mvs: [] as MV[],
  artists: [] as Artist[],
  clouds: [] as Track[],
  recently: [] as Track[],
  loadingRecent: false,
  loading: {
    playlists: false,
    albums: false,
    artists: false,
    mvs: false,
    cloud: false,
  },
})
const type = computed(() => {
  return {
    0: 'playlists',
    1: 'albums',
    2: 'artists',
    3: 'mvs',
    4: 'clouds',
  }[state.tab]
})
fetch()
async function fetch() {
  const {
    data: { list = [] },
  } = await recent(15)
  state.recently = list
}

async function loadData() {
  await nextTick()
  if (type.value === 'albums' && !state.albums.length) {
    state.loading[type.value] = true
    const { data } = await favAlbums()
    state.albums = data
  } else if (type.value === 'artists' && !state.artists.length) {
    state.loading[type.value] = true
    const { data } = await favArtists()
    state.artists = data
  } else if (type.value === 'mvs' && !state.mvs.length) {
    state.loading[type.value] = true
    const { data } = await favMVs()
    state.mvs = data
  } else if (type.value === 'clouds' && !state.clouds.length) {
    state.loading[type.value] = true
    const { data } = await cloudDiskMusicList()
    state.clouds = data.map((song) => song.simpleSong)
  }
  state.loading[type.value] = false
}
</script>
