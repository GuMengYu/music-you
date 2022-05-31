<template>
  <section>
    {{ index }}
    <h1 class="text-h6">{{ $t('common.queue') }}</h1>
    <h2 class="text-subtitle-2 my-2">{{ $t('common.current_play') }}</h2>
    <track-item v-if="current" :track="current" :index="1" type="list" />
    <h2 class="text-subtitle-2 my-2">{{ $t('common.next_from') }}</h2>
    <track-list :tracks="nextList" type="list"> </track-list>
    <template v-if="!nextList.length">
      <p class="d-flex justify-center font-weight-bold">
        {{ $t('common.empty_playing_list') }}
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()
const { playingList, track: current } = storeToRefs(playerStore)

const index = computed(() => {
  const index = playingList.value.list.findIndex((track) => track.id === current.value?.id)
  return index + 1
})
const nextList = computed(() => {
  const list = playingList.value.list
  if (!list || !list.length) return []
  return list.slice(index.value)
})
</script>
