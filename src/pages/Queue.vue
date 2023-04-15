<template>
  <section class="d-flex flex-column gap-6">
    <div>
      <h1 class="text-h6 mb-2">{{ $t('common.queue') }}</h1>
      <h2 class="text-subtitle-2">{{ $t('common.current_play') }}</h2>
      <track-item v-if="current" :track="current" :index="1" album />
    </div>
    <div v-if="priorityQueue.length">
      <div class="d-flex align-center gap-2 justify-space-between mb-1">
        <h2 class="text-subtitle-2">{{ $t('common.queue_next') }}</h2>
        <v-btn size="small" color="primary" class="rounded-pill" variant="outlined" @click="clearPriority">
          清空
        </v-btn>
      </div>
      <track-item
        v-for="(track, idx) in priorityQueue"
        :key="track.id"
        :track="track"
        :index="idx + 2"
        album
        @play="play(track)"
      />
    </div>
    <div v-if="nextList.length">
      <div class="d-flex align-center gap-2">
        <h2 class="text-subtitle-2">{{ $t('common.next_from') }}</h2>
        <router-link :to="to" class="text-primary">{{ queue.name }}</router-link>
        <v-btn size="small" color="primary" class="rounded-pill ml-auto" variant="outlined" @click="clearQueue">
          清空
        </v-btn>
      </div>
      <!-- todo: 需要虚拟列表优化此处渲染 -->
      <track-list :tracks="nextList" type="playlist" :offset-index="priorityQueue.length + 2" set-queue> </track-list>
    </div>
    <template v-if="noMore">
      <v-divider />
      <p class="d-flex justify-center font-weight-bold">
        {{ $t('common.empty_playing_list') }}
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'
const playerStore = usePlayerStore()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const { track: current } = storeToRefs(playerStore)

const { queue, priorityQueue } = storeToRefs(playQueueStore)

const nextList = computed(() => {
  return queue.value.states.map((state) => {
    return queue.value.tracks.find((track) => track.id === state.id) as Track
  })
})

const noMore = computed(() => {
  return !(nextList.value.length + priorityQueue.value.length)
})
function clearPriority() {
  playQueueStore.updatePriorityQueue([])
  // todo clear
}
function clearQueue() {
  playQueueStore.clearQueue()
}
function play(track: Track) {
  player.updatePlayerTrack(track.id, true, true, false, track.source?.from)
}
const to = computed(() => {
  return {
    album: `/album/${queue.value.id}`,
    playlist: `/playlist/${queue.value.id}`,
    artist: `/artist/${queue.value.id}`,
    daily: `/daily`,
    cloud: '/library/cloud',
    recent: '/recent',
    intelligence: '',
    program: `/podcast/${queue.value.id}`,
    unknown: '',
  }[queue.value.type!]
})
</script>
