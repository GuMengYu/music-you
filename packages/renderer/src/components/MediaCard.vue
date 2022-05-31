<template>
  <v-card rounded="lg" height="130" :theme="theme">
    <v-img
      :src="coverImage"
      cover
      :aspect-ratio="16 / 9"
      class="rounded-lg"
      gradient="90deg, rgb(0 0 0 / 76%) 0%, rgb(0 0 0 / 0%) 50%, rgb(0 0 0 / 76%) 100%"
    >
      <div class="d-flex flex-column justify-space-between fill-height pt-2">
        <div class="d-flex justify-space-between px-2">
          <v-icon color="primary" size="small"> {{ mdiMusicCircle }} </v-icon>
        </div>
        <div class="d-flex justify-space-between px-2">
          <div class="d-flex flex-column text-caption">
            <span>{{ track?.name }}</span>
            <span>{{ track?.ar?.[0]?.name }}</span>
          </div>
          <v-btn icon flat size="x-small" color="primary" @click="togglePlay">
            <v-icon size="x-small">{{ playing ? mdiPause : mdiPlay }}</v-icon>
          </v-btn>
        </div>
        <div class="d-flex justify-lg-space-between">
          <v-btn icon variant="text" size="x-small" @click="prev">
            <v-icon size="x-small">{{ mdiSkipPreviousOutline }}</v-icon>
          </v-btn>
          <v-slider
            :model-value="currentTime * 1000"
            :thumb-label="false"
            :min="0"
            :max="trackDt"
            class="track-slider"
            density="compact"
            :track-size="2"
            track-color="#fff"
            track-fill-color="#fff"
            :thumb-size="8"
            thumb-color="#fff"
            :hide-details="true"
          />
          <v-btn icon variant="text" size="x-small" color="white" @click="next">
            <v-icon size="x-small">{{ mdiSkipNextOutline }}</v-icon>
          </v-btn>
          <!-- <v-btn icon variant="text" size="x-small">
            <v-icon size="x-small">{{ mdiShuffle }}</v-icon>
          </v-btn> -->
          <v-btn icon variant="text" size="x-small">
            <v-icon size="x-small">{{ mdiHeartOutline }}</v-icon>
          </v-btn>
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script setup lang="ts">
import {
  mdiHeartOutline,
  mdiMusicCircle,
  mdiPause,
  mdiPlay,
  mdiShuffle,
  mdiSkipNextOutline,
  mdiSkipPreviousOutline,
} from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { sizeOfImage } from '@/util/fn'
const player = usePlayer()
const settingStore = useSettingStore()

const playerStore = usePlayerStore()
const { currentTime, track, playing } = storeToRefs(playerStore)
const trackDt = computed(() => track.value?.dt ?? 0)
const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})
const togglePlay = () => {
  playing.value = !playing.value
}
const coverImage = computed(() => {
  return sizeOfImage(track.value?.al?.picUrl ?? '', 512)
})

const next = () => {
  player.next()
}
const prev = () => {
  player.prev()
}
</script>
