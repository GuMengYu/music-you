<script setup lang="ts">
import { mdiSkipNext, mdiSkipPrevious } from '@mdi/js'

import usePlayerControl from '@/hooks/usePlayerControl'
import { PLAY_MODE } from '@/store/player'
import { playToPause as playToPauseAnimationData } from '@/util/animationData.json'

import VSquareBtn from './button/VSquareBtn.vue'

const {
  toggle,
  prev,
  next,
  toggleShuffle,
  toggleMode,
  playing,
  loadingTrack,
  playMode,
  shuffle,
  isCurrentFm,
  modeIcon,
  shuffleIcon,
} = usePlayerControl()

defineProps({
  simple: {
    type: Boolean,
    default: false,
  },
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

onMounted(() => {
  starPlayAnimate(playing.value)
})
watch(playing, (val) => {
  starPlayAnimate(val)
})

function starPlayAnimate(playing: boolean) {
  if (playing) {
    playAnim.value?.playSegments([0, 30], true)
  } else {
    playAnim.value?.playSegments([30, 60], true)
  }
}
function handleAnimation(animation: any) {
  playAnim.value = animation
  playAnim.value.setSpeed(2)
}
</script>
<template>
  <div class="d-flex justify-center align-center control-buttons">
    <v-btn v-if="!simple" icon :disabled="isCurrentFm" variant="text" @click="toggleShuffle">
      <v-icon size="x-small" :color="shuffle ? 'primary' : ''">
        {{ shuffleIcon }}
      </v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" variant="text" @click="prev">
      <v-icon size="small">{{ mdiSkipPrevious }}</v-icon>
    </v-btn>
    <v-square-btn
      :loading="loadingTrack"
      :rounded="playing ? 'lg' : 'pill'"
      variant="flat"
      color="primaryContainer"
      size="large"
      class="mx-2"
      elevation="1"
      @click="toggle"
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
    <v-btn v-if="!simple" icon :disabled="isCurrentFm" variant="text" @click="toggleMode">
      <v-icon size="x-small" :color="repeatOn && !isCurrentFm ? 'primary' : ''">
        {{ modeIcon }}
      </v-icon>
    </v-btn>
  </div>
</template>
