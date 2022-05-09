<template>
  <section class="playing-queue">
    <h1 class="text-h6 mb-2">队列</h1>
    <h2 class="text-subtitle-2">当前播放</h2>
    <v-list nav density="compact">
      <track-item :track="track" :index="1" />
    </v-list>
    <h2 class="text-subtitle-2 mt-4">
      下一首歌来自: <a class="text-decoration-none" href="/playlist/37i9dQZF1E35pcuTMOe4vE">Daily Mix 2</a>
    </h2>
    <v-list nav density="compact">
      <template v-for="(song, index) in playingList.list" :key="song.id">
        <track-item :track="song" :index="index + 2" @play="eventBus.emit(song.id)" />
      </template>
      <template v-if="!playingList.list.length">
        <p class="d-flex justify-center font-weight-bold">
          {{ $t('common.empty_playing_list') }}
        </p>
      </template>
    </v-list>
  </section>
</template>

<script setup lang="ts">
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import TrackItem from '@/components/app/TrackItem.vue'
import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()
const { playingList, track } = storeToRefs(playerStore)
const eventBus = useEventBus<string>('addToQueue')
</script>
