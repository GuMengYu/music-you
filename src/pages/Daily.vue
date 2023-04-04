<template>
  <Col :title="$t('main.daily.title')" :subtitle="$t('main.daily.sub')">
    <template #more>
      <v-square-btn
        color="primaryContainer"
        variant="flat"
        elevation="1"
        size="large"
        rounded="md"
        :loading="loading"
        @click="play"
      >
        <v-icon> {{ mdiPlay }}</v-icon>
      </v-square-btn>
    </template>
    <track-list :tracks="daily" header type="daily" @update-list="(list) => (daily = [...list])"> </track-list>
  </Col>
</template>

<script lang="ts">
import { mdiPlay } from '@mdi/js'
import dayjs from 'dayjs'

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
    const toDay = dayjs().format('MM/DD')
    getDailyRecommend().then(({ data }) => {
      daily.value = data?.dailySongs ?? []
    })
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
      toDay,
      mdiPlay,
    }
  },
})
</script>
