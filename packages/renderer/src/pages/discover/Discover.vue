<template>
  <div class="discover d-flex flex-column gap-6">
    <discover-loader v-if="state.loading" />
    <ShortcutGrid />
    <Col :title="$t('main.for_you')">
      <card-row>
        <cover v-for="list in state.playLists" :key="list.id" :data="list" type="playlist" />
      </card-row>
    </Col>
    <Col :title="$t('main.radar')">
      <card-row>
        <cover v-for="list in state.radarPlayLists" :key="list.id" :data="list" type="playlist" :title-line="2" />
      </card-row>
    </Col>
    <Col :title="$t('main.discover.recommend_songs')">
      <card-row>
        <Cover v-for="song in state.songs" :key="song.id" :data="song.album">
          <v-card-subtitle class="px-4 pb-4">
            <artists-link :artists="song.artists" />
          </v-card-subtitle>
        </Cover>
      </card-row>
    </Col>
  </div>
</template>
<script setup lang="ts">
import { personalizedMV, personalizedPlaylist, personalizedRadar, personalizedSong } from '@/api/personalized'
import type { MV, Playlist, TrackSource } from '@/types'

import ShortcutGrid from './shortcuts/ShortcutGrid.vue'
interface RootState {
  playLists: Playlist[]
  radarPlayLists: Playlist[]
  songs: TrackSource[]
  mvs: MV[]
  loading: boolean
}
const state = reactive<RootState>({
  radarPlayLists: [],
  playLists: [],
  mvs: [],
  songs: [],
  loading: false,
})

onMounted(() => {
  fetch()
})
const fetch = async () => {
  state.loading = true
  try {
    const [{ result: playLists }, { result: mvs }, { result: songs }, radars] = await Promise.all([
      personalizedPlaylist(7),
      personalizedMV(),
      personalizedSong(7),
      personalizedRadar(),
    ])
    state.playLists = playLists
    state.mvs = mvs
    state.songs = songs.map((i) => i.song)
    state.radarPlayLists = radars
  } catch (e) {
    console.log(e)
  } finally {
    state.loading = false
  }
}
</script>
