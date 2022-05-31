<script setup lang="ts">
import {
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiShuffle,
  mdiShuffleDisabled,
  mdiSkipNext,
  mdiSkipPrevious,
} from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { usePlayer } from '@/player/player'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import { playToPause as playToPauseAnimationData } from '@/util/animationData.json'

const playerStore = usePlayerStore()
const player = usePlayer()

const { loadingTrack, playing, playMode, shuffle, isCurrentFm } = storeToRefs(playerStore)

const orderIconState = computed(() => {
  return (
    {
      [PLAY_MODE.DISABLE]: mdiRepeatOff,
      [PLAY_MODE.NORMAL]: mdiRepeat,
      [PLAY_MODE.REPEAT]: mdiRepeat,
      [PLAY_MODE.REPEAT_ONCE]: mdiRepeatOnce,
    }[playMode.value as string] ?? mdiRepeat
  )
})
const playAnim = ref()
const playOptions = {
  animationData: playToPauseAnimationData,
  loop: false,
  autoplay: false,
}

const switchMode = () => {
  const mode = playMode.value as string
  if (mode === PLAY_MODE.DISABLE) {
    playMode.value = PLAY_MODE.NORMAL
  } else if (mode === PLAY_MODE.NORMAL) {
    playMode.value = PLAY_MODE.REPEAT
  } else {
    playMode.value = PLAY_MODE.DISABLE
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
  player.next()
}
function prev() {
  player.prev()
}

function handleAnimation(animation) {
  playAnim.value = animation
  playAnim.value.setSpeed(2)
}
function toggleShuffle() {
  // todo shuffle
}
</script>
<template>
  <div class="d-flex justify-center align-center control-buttons gap-2">
    <v-btn icon :disabled="isCurrentFm" flat size="small" @click="toggleShuffle">
      <v-icon size="x-small">
        {{ shuffle ? mdiShuffle : mdiShuffleDisabled }}
      </v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" flat size="small" @click="prev">
      <v-icon size="x-small">{{ mdiSkipPrevious }}</v-icon>
    </v-btn>

    <v-btn
      icon
      class="play-fab"
      :style="{
        animation: playing ? 'pulseWarn 1.5s infinite' : '',
      }"
      size="small"
      color="primary"
      :loading="loadingTrack"
      variant="contained-flat"
      @click="togglePlay"
    >
      <v-progress-circular v-show="loadingTrack" indeterminate color="onPrimary" />
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

    <v-btn icon flat size="small" @click="next">
      <v-icon size="x-small">{{ mdiSkipNext }}</v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" flat size="small" @click="switchMode">
      <v-icon size="x-small">
        {{ orderIconState }}
      </v-icon>
    </v-btn>
  </div>
</template>
