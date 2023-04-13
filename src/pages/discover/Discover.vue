<template>
  <div>
    <discover-loader v-if="state.loading" />
    <section v-else class="discover d-flex flex-column gap-6">
      <Col :title="welcome">
        <ShortcutGrid />
        <template #more>
          <v-btn icon size="x-small" variant="tonal" color="tertiary" @click="config = !config">
            <v-icon> {{ mdiPaletteOutline }} </v-icon>
          </v-btn>
        </template>
      </Col>
      <Col :title="$t('main.for_you')">
        <card-row single-line>
          <cover v-for="list in state.playLists" :key="list.id" :data="list" type="playlist" />
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
      <Col title="播客">
        <card-row single-line>
          <podcast-cover v-for="list in state.podcasts" :key="list.id" :data="list" />
        </card-row>
      </Col>
    </section>
    <discover-config v-model="config" />
  </div>
</template>
<script setup lang="ts">
import { mdiPaletteOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { personalizedPlaylist, personalizedPodcast, personalizedRadar, personalizedSong } from '@/api/personalized'
import useAjaxReloadHook from '@/hooks/useAjaxReload'
import DiscoverConfig from '@/pages/modal/DiscoverConfig.vue'
import { useUserStore } from '@/store/user'
import type { Playlist, Podcast, Track } from '@/types'

import ShortcutGrid from './shortcuts/ShortcutGrid.vue'
interface RootState {
  playLists: Playlist[]
  radarPlayLists: Playlist[]
  songs: Track[]
  podcasts: Podcast[]
  loading: boolean
}
const userStore = useUserStore()
const { logged, account } = storeToRefs(userStore)

const { t } = useI18n()
const config = ref(false)
const state = reactive<RootState>({
  radarPlayLists: [],
  playLists: [],
  songs: [],
  podcasts: [],
  loading: false,
})

const welcome = computed(() => {
  const hours = new Date().getHours()
  let welcome = ''
  if (hours >= 0 && hours <= 6) {
    welcome = t('common.dawning')
  } else if (hours > 6 && hours <= 11) {
    welcome = t('common.morning')
  } else if (hours > 11 && hours <= 14) {
    welcome = t('common.noon')
  } else if (hours > 14 && hours <= 18) {
    welcome = t('common.afternoon')
  } else if (hours > 18 && hours <= 23) {
    welcome = t('common.evening')
  } else {
    welcome = t('common.midnight')
  }
  return `${welcome}${logged.value ? `，${account.value?.profile?.nickname}` : ''}`
})

const fetch = async () => {
  state.loading = true
  try {
    const [playLists, { result: songs }, radars, { data: podcasts }] = await Promise.all([
      personalizedPlaylist(),
      personalizedSong(7),
      personalizedRadar(),
      personalizedPodcast(),
    ])
    state.playLists = playLists
    state.podcasts = podcasts
    state.songs = songs.map((i) => i.song)
    state.radarPlayLists = radars
  } catch (e) {
    console.log(e)
  } finally {
    state.loading = false
  }
}
fetch()
useAjaxReloadHook('discover', fetch)
</script>
