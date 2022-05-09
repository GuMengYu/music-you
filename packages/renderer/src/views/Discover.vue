<template>
  <div class="discover">
    <discover-loader v-if="state.loading" />
    <custom-col :title="welcome" h-class="text-h5">
      <shortcuts />
    </custom-col>
    <custom-col :title="$tc('main.for_you')">
      <card-row>
        <cover v-for="list in state.playLists" :key="list.id" :data="list" type="playlist" />
      </card-row>
    </custom-col>
    <custom-col :title="$tc('main.radar')">
      <card-row>
        <cover v-for="list in state.radarPlayLists" :key="list.id" :data="list" type="playlist" :title-line="2" />
      </card-row>
    </custom-col>
    <custom-col :title="$tc('main.discover.recommend_songs')">
      <card-row>
        <cover v-for="song in state.songs" :key="song.id" :data="song.album">
          <v-card-subtitle class="px-3 pb-2">
            <artists-link :artists="song.artists" />
          </v-card-subtitle>
        </cover>
      </card-row>
    </custom-col>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

import { getMv, getNewRelease, getPersonalized, recommendPlaylist } from '@/api'
import { getRadarList } from '@/api/music'
import DiscoverLoader from '@/components/app/skeleton/DiscoverLoader.vue'
import { useUserStore } from '@/store/user'

import ArtistsLink from '../components/app/artist/ArtistsLink.vue'
import Cover from '../components/app/cover/Cover.vue'
import CardRow from '../components/app/layout/CardRow.vue'
import CustomCol from '../components/app/layout/Col.vue'
import Shortcuts from '../components/app/shortcuts/list.vue'

const userStore = useUserStore()
const { t } = useI18n()
const { logged, account } = storeToRefs(userStore)
interface RootState {
  playLists: any[]
  radarPlayLists: any[]
  songs: any[]
  mvs: []
  loading: boolean
}
const state = reactive<RootState>({
  radarPlayLists: [],
  playLists: [],
  mvs: [],
  songs: [],
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
    const [recommend, { result: mvs }, { result: songs }, radars] = await Promise.all([
      logged.value ? recommendPlaylist() : getPersonalized(7),
      getMv(),
      getNewRelease({ limit: 7 }),
      getRadarList(),
    ])
    state.playLists = logged.value ? recommend['recommend'] : recommend['result']
    state.mvs = mvs
    state.songs = songs.map((i) => i?.song)
    state.radarPlayLists = radars
  } catch (e) {
    console.log(e)
  } finally {
    state.loading = false
  }
}

fetch()
</script>
<style lang="scss" scoped>
.discover {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
