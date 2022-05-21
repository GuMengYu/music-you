<template>
  <section>
    <h1 class="text-h6">队列</h1>
    <h2 class="text-subtitle-2 my-2">当前播放</h2>
    <track-item v-if="current" :track="current" :index="1" type="list" />
    <h2 class="text-subtitle-2 my-2">
      下一首歌来自: &nbsp;
      <router-link :to="form.url" class="text-onSurfaceVariant">{{ form.name }}</router-link>
    </h2>
    <track-list :tracks="playingList.list" type="list"> </track-list>
    <template v-if="!playingList.list.length">
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
const form = computed(() => {
  return {
    url: '/playlist/37i9dQZF1E35pcuTMOe4vE',
    name: 'Daily Mix 2',
  }
})
</script>
