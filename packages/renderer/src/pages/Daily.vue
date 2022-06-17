<template>
  <div>
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
    <track-list :tracks="daily" header type="list"> </track-list>
  </div>
</template>

<script lang="ts">
import { mdiPlay } from '@mdi/js'
import dayjs from 'dayjs'
import { defineComponent, ref } from 'vue'

import { getDailyRecommend } from '@/api/user'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'
export default defineComponent({
  name: 'Daily',
  setup() {
    const player = usePlayer()
    const playQueueStore = usePlayQueueStore()
    const loading = ref(false)
    const daily = ref<Track[]>([])
    async function play() {
      loading.value = true
      playQueueStore.updatePlayQueue(0, 'daily', '日推', daily.value)
      player.next()
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
