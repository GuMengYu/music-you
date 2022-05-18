<template>
  <div>
    <div class="title mb-5">
      <div class="text-caption grey--text font-weight-bold">
        {{ date }}
      </div>
      <div class="d-flex justify-space-between">
        <div class="text-h6 font-weight-bold">
          {{ $t('main.nav.daily') }}
        </div>
        <v-btn size="small" :loading="loading" color="primary" @click="play">
          <v-icon> {{ icon.mdiPlay }}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-list>
      <TrackItem v-for="track in daily" :key="track.id" :track="track"> </TrackItem>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mdiPlay } from '@mdi/js'
import dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'

import { getDailyRecommend } from '@/api/user'
import { usePlayer } from '@/player/player'
import type { Track } from '@/types'
export default defineComponent({
  name: 'Daily',
  setup() {
    const player = usePlayer()
    const loading = ref(false)
    const daily = ref<Track[]>([])
    async function play() {
      loading.value = true
      await player.updateTracks({ list: daily.value }, true)
      loading.value = false
    }
    return {
      daily,
      play,
      loading,
    }
  },
  data: () => ({
    icon: {
      mdiPlay,
    },
    date: dayjs().format('MM/DD'),
  }),
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      const { data } = await getDailyRecommend()
      this.daily = data?.dailySongs ?? []
    },
  },
})
</script>
