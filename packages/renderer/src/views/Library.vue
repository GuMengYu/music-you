<template>
  <div>
    <custom-col title="最近播放" subtitle="activity" class="mb-4">
      <card-row :grid-type="GridType.C">
        <track-item
          v-for="(track, idx) in state.recently"
          :key="track['resourceId']"
          :track="track.data"
          :index="idx + 1"
          from="album"
        />
      </card-row>
    </custom-col>
    <v-tabs v-model="state.tab" class="mb-4">
      <v-tab v-for="t in state.tabs" :key="t.key" class="font-weight-bold" @click="loadData">
        {{ t.name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="state.tab" class="tab_page pt-4">
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
    </v-window>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { favAlbums, favArtists, favMVs, getUserPlaylist, recent } from '@/api/user'
import ArtistsCover from '@/components/app/cover/ArtistsCover.vue'
import Cover from '@/components/app/cover/Cover.vue'
import VideoCover from '@/components/app/cover/VideoCover.vue'
import CardRow from '@/components/app/layout/CardRow.vue'
import CustomCol from '@/components/app/layout/Col.vue'
import TrackItem from '@/components/app/TrackItem.vue'
import { GridType } from '@/hooks/useResponsiveGrid'
const { t } = useI18n()

import { storeToRefs } from 'pinia'

import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const { playlists } = storeToRefs(userStore)
const state = reactive({
  tabs: [
    { key: 'playlists', name: t('main.playlists') },
    { key: 'albums', name: t('main.albums') },
    { key: 'artists', name: t('main.artists') },
    { key: 'mvs', name: t('main.mvs') },
  ],
  tab: 0,
  albums: [],
  mvs: [],
  artists: [],
  recently: [],
  loadingRecent: false,
  loading: {
    playlists: false,
    albums: false,
    artists: false,
    mvs: false,
  },
})
const type = computed(() => {
  return {
    0: 'playlists',
    1: 'albums',
    2: 'artists',
    3: 'mvs',
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
  }
  state.loading[type.value] = false
}
</script>
