<template>
  <div class="d-flex flex-column">
    <div v-if="nextList.length">
      <RecycleScroller
        v-slot="{ item: track, index }"
        class="scroller"
        :style="{
          height: `340px`,
        }"
        :items="nextList"
        :item-size="64"
        key-field="id"
      >
        <TrackI :track="track" :index="index + 1" />
      </RecycleScroller>
    </div>
    <template v-if="noMore">
      <v-divider />
      <p class="d-flex justify-center font-weight-bold">
        {{ t('common.empty_playing_list') }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'

import TrackI from './Track.vue'
const playerStore = usePlayerStore()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const { track: current } = storeToRefs(playerStore)
const { t } = useI18n()
const { queue, priorityQueue } = storeToRefs(playQueueStore)

const nextList = computed(() => {
  return queue.value.tracks
})

const noMore = computed(() => {
  return !(nextList.value.length + priorityQueue.value.length)
})
function clearPriority() {
  playQueueStore.updatePriorityQueue([])
  // todo clear
}
function play(trackId: number) {
  player.updatePlayerTrack(trackId)
}
const to = computed(() => {
  return {
    album: `/album/${queue.value.id}`,
    playlist: `/playlist/${queue.value.id}`,
    artist: `/artist/${queue.value.id}`,
    daily: `/daily`,
  }[queue.value.type!]
})
</script>
