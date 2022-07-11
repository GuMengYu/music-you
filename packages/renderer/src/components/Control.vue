<script setup lang="ts">
import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { usePlayer } from '@/player/player'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { playToPause as playToPauseAnimationData } from '@/util/animationData.json'
const mdiRepeatOff =
  'M7 22 3 18 7 14 8.4 15.45 6.85 17H17V13H19V19H6.85L8.4 20.55ZM5 11V5H17.15L15.6 3.45L17 2L21 6L17 10L15.6 8.55L17.15 7H7V11Z'
const mdiRepeatOnce =
  'M11.5 15H13V9H10V10.5H11.5ZM3 23Q2.175 23 1.588 22.413Q1 21.825 1 21V3Q1 2.175 1.588 1.587Q2.175 1 3 1H21Q21.825 1 22.413 1.587Q23 2.175 23 3V21Q23 21.825 22.413 22.413Q21.825 23 21 23ZM7 22 8.4 20.55 6.85 19H19V13H17V17H6.85L8.4 15.45L7 14L3 18ZM5 11H7V7H17.15L15.6 8.55L17 10L21 6L17 2L15.6 3.45L17.15 5H5Z'
const mdiRepeat =
  'M3 23Q2.175 23 1.588 22.413Q1 21.825 1 21V3Q1 2.175 1.588 1.587Q2.175 1 3 1H21Q21.825 1 22.413 1.587Q23 2.175 23 3V21Q23 21.825 22.413 22.413Q21.825 23 21 23ZM7 22 8.4 20.55 6.85 19H19V13H17V17H6.85L8.4 15.45L7 14L3 18ZM5 11H7V7H17.15L15.6 8.55L17 10L21 6L17 2L15.6 3.45L17.15 5H5Z'

const mdiShuffleDisabled =
  'M9.175 10.575 4 5.4 5.4 4 10.575 9.175ZM14 20V18H16.6L13.425 14.825L14.85 13.4L18 16.55V14H20V20ZM5.4 20 4 18.6 16.6 6H14V4H20V10H18V7.4Z'
const mdiShuffle =
  'M3 23Q2.175 23 1.588 22.413Q1 21.825 1 21V3Q1 2.175 1.588 1.587Q2.175 1 3 1H21Q21.825 1 22.413 1.587Q23 2.175 23 3V21Q23 21.825 22.413 22.413Q21.825 23 21 23ZM9.175 10.575 10.575 9.175 5.4 4 4 5.4ZM14 20H20V14H18V16.55L14.85 13.4L13.425 14.825L16.6 18H14ZM5.4 20 18 7.4V10H20V4H14V6H16.6L4 18.6Z'

const playerStore = usePlayerStore()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()

const { loadingTrack, playing, playMode, shuffle, isCurrentFm } = storeToRefs(playerStore)

const orderIconState = computed(() => {
  return (
    {
      [PLAY_MODE.NORMAL]: mdiRepeatOff,
      [PLAY_MODE.REPEAT]: mdiRepeat,
      [PLAY_MODE.REPEAT_ONCE]: mdiRepeatOnce,
    }[playMode.value as string] ?? mdiRepeat
  )
})
const repeatOn = computed(() => {
  return [PLAY_MODE.REPEAT, PLAY_MODE.REPEAT_ONCE].includes(playMode.value)
})
const playAnim = ref()
const playOptions = {
  animationData: playToPauseAnimationData,
  loop: false,
  autoplay: false,
}

const switchMode = () => {
  const mode = playMode.value as string
  if (mode === PLAY_MODE.NORMAL) {
    playMode.value = PLAY_MODE.REPEAT
  } else if (mode === PLAY_MODE.REPEAT) {
    playMode.value = PLAY_MODE.REPEAT_ONCE
  } else if (mode === PLAY_MODE.REPEAT_ONCE) {
    playMode.value = PLAY_MODE.NORMAL
  }
}

const togglePlay = () => {
  playing.value = !playing.value
}

watch(playing, (val) => {
  if (val) {
    playAnim.value?.playSegments([0, 30], true)
  } else {
    playAnim.value?.playSegments([30, 60], true)
  }
})
function next() {
  if (isCurrentFm) {
    player.nextFm()
  } else {
    player.next()
  }
}
function prev() {
  player.prev()
}

function handleAnimation(animation) {
  playAnim.value = animation
  playAnim.value.setSpeed(2)
}
function toggleShuffle() {
  if (shuffle.value) {
    playQueueStore.unShuffle()
    shuffle.value = false
  } else {
    playQueueStore.shuffle()
    shuffle.value = true
  }
}
</script>
<template>
  <div class="d-flex justify-center align-center control-buttons gap-2">
    <v-btn icon :disabled="isCurrentFm" variant="text" size="small" @click="toggleShuffle">
      <v-icon size="x-small" :color="shuffle ? 'primary' : ''">
        {{ shuffle ? mdiShuffle : mdiShuffleDisabled }}
      </v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" variant="text" size="small" @click="prev">
      <v-icon size="small">{{ mdiSkipPrevious }}</v-icon>
    </v-btn>

    <v-btn
      icon
      class="play-fab"
      :style="{
        animation: playing ? 'pulseWarn 1.5s infinite' : '',
      }"
      color="primary"
      :loading="loadingTrack"
      variant="flat"
      @click="togglePlay"
    >
      <lottie-icon
        v-show="!loadingTrack"
        class="lottie-icon"
        style="position: relative; top: 1px"
        :options="playOptions"
        :width="30"
        :height="30"
        @anim-created="handleAnimation"
      ></lottie-icon>
    </v-btn>

    <v-btn icon variant="text" size="small" @click="next">
      <v-icon size="small">{{ mdiSkipNext }}</v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" variant="text" size="small" @click="switchMode">
      <v-icon size="x-small" :color="repeatOn && !isCurrentFm ? 'primary' : ''">
        {{ orderIconState }}
      </v-icon>
    </v-btn>
  </div>
</template>
