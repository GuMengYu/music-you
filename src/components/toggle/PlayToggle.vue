<script setup lang="ts">
import usePlayerControl from '@/hooks/usePlayerControl'
import playToPauseAnimationData from '@/util/lottie-assets/playpause.json'

import VSquareBtn from '../button/VSquareBtn.vue'

const { toggle, prev, next, playing, loadingTrack } = usePlayerControl()

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
  <v-square-btn
    :loading="loadingTrack"
    variant="flat"
    color="primaryContainer"
    class="mx-2"
    elevation="1"
    :style="{
      transition: 'background-color, border-radius 350ms cubic-bezier(0.4, 0, 0.2, 1)',
      height: '50px',
      width: '50px',
      borderRadius: playing ? '14px' : '50px',
    }"
    @click="toggle"
  >
    <lottie-icon
      v-show="!loadingTrack"
      class="lottie-icon text-onPrimaryContainer"
      style="position: relative; left: -1.5px"
      :options="playOptions"
      :width="36"
      :height="30"
      @anim-created="handleAnimation"
    ></lottie-icon>
  </v-square-btn>
</template>
