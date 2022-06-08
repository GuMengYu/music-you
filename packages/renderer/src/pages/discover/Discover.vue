<template>
  <div>
    <discover-loader v-if="state.loading" />
    <section v-else class="discover d-flex flex-column gap-6">
      <ShortcutGrid />
      <Col :title="$t('main.for_you')">
        <card-row single-line>
          <cover v-for="list in state.playLists" :key="list.id" :data="list" type="playlist" :title-line="2" />
        </card-row>
      </Col>
      <Col :title="$t('main.radar')">
        <card-row single-line>
          <cover v-for="list in state.radarPlayLists" :key="list.id" :data="list" type="playlist" :title-line="2" />
        </card-row>
      </Col>
      <Col :title="$t('main.discover.recommend_songs')">
        <card-row single-line>
          <Cover v-for="song in state.songs" :key="song.id" :data="song.album">
            <v-card-subtitle class="px-4 pb-2">
              <artists-link :artists="song.artists" />
            </v-card-subtitle>
          </Cover>
        </card-row>
      </Col>
    </section>
  </div>
</template>
<script setup lang="ts">
import { personalizedMV, personalizedPlaylist, personalizedRadar, personalizedSong } from '@/api/personalized'
import { recommendPlaylist } from '@/api/user'
import type { MV, Playlist, Track } from '@/types'

import ShortcutGrid from './shortcuts/ShortcutGrid.vue'
interface RootState {
  playLists: Playlist[]
  radarPlayLists: Playlist[]
  songs: Track[]
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
    const [playLists, { result: mvs }, { result: songs }, radars] = await Promise.all([
      personalizedPlaylist(),
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
