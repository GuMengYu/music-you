<template>
  <div>
    <discover-loader v-if="state.loading" />
    <section v-else class="discover d-flex flex-column gap-6">
      <Col :title="welcome" h-class="font-weight-bold text-h6">
        <ShortcutGrid />
        <template #more>
          <v-btn icon size="x-small" variant="tonal" color="tertiary" @click="config = !config">
            <v-icon> {{ mdiPaletteOutline }} </v-icon>
          </v-btn>
        </template>
      </Col>
      <Col v-for="i in cols" :key="i.key" :title="i.title">
        <card-row v-if="i.key === COLUMNS.CUSTOM" single-line>
          <cover v-for="list in state.playLists" :key="list.id" :data="list" type="playlist" />
        </card-row>
        <card-row v-if="i.key === COLUMNS.RADAR" single-line>
          <cover v-for="list in state.radarPlayLists" :key="list.id" :data="list" type="playlist" :title-line="2" />
        </card-row>
        <card-row v-if="i.key === COLUMNS.NEW_MUSIC" single-line>
          <Cover v-for="song in state.songs" :key="song.id" :data="song.album">
            <v-card-subtitle class="px-4 pb-2">
              <artists-link :artists="song.artists" />
            </v-card-subtitle>
          </Cover>
        </card-row>
        <card-row v-if="i.key === COLUMNS.PODCAST" single-line>
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
import { useDefinedItems } from '@/pages/discover/useDiscover'
import DiscoverConfig from '@/pages/modal/DiscoverConfig.vue'
import { COLUMNS, useHomeConfigStore } from '@/store/homeConfig'
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
useScrollToTop()

const userStore = useUserStore()
const homeConfigStore = useHomeConfigStore()
const { logged, account } = storeToRefs(userStore)
const { columnAndSort } = storeToRefs(homeConfigStore)
const { columns } = useDefinedItems()
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
const cols = computed(() => {
  return columnAndSort.value.map((i) => {
    return columns.value[i]
  })
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
