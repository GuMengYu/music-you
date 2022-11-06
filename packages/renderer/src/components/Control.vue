<script setup lang="ts">
import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { usePlayer } from '@/player/player'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { playToPause as playToPauseAnimationData } from '@/util/animationData.json'
import { mdiRepeat, mdiRepeatOff, mdiRepeatOnce, mdiShuffle, mdiShuffleDisabled } from '@/util/icons'

import VSquareBtn from './button/VSquareBtn.vue'

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
  if (isCurrentFm.value) {
    player.nextFm()
  } else {
    player.next()
  }
}
function prev() {
  player.prev()
}

function handleAnimation(animation: any) {
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
  <div class="d-flex justify-center align-center control-buttons">
    <v-btn icon :disabled="isCurrentFm" variant="text" @click="toggleShuffle">
      <v-icon size="x-small" :color="shuffle ? 'primary' : ''">
        {{ shuffle ? mdiShuffle : mdiShuffleDisabled }}
      </v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" variant="text" @click="prev">
      <v-icon size="small">{{ mdiSkipPrevious }}</v-icon>
    </v-btn>
    <v-square-btn
      color="primaryContainer"
      :loading="loadingTrack"
      variant="flat"
      rounded="lg"
      size="large"
      class="mx-2"
      elevation="1"
      @click="togglePlay"
    >
      <lottie-icon
        v-show="!loadingTrack"
        class="lottie-icon"
        style="position: relative; top: 2px"
        :options="playOptions"
        :width="30"
        :height="30"
        @anim-created="handleAnimation"
      ></lottie-icon>
    </v-square-btn>

    <v-btn icon variant="text" @click="next">
      <v-icon size="small">{{ mdiSkipNext }}</v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" variant="text" @click="switchMode">
      <v-icon size="x-small" :color="repeatOn && !isCurrentFm ? 'primary' : ''">
        {{ orderIconState }}
      </v-icon>
    </v-btn>
  </div>
</template>
