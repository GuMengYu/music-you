<script setup lang="ts">
import usePlayerControl from '@/hooks/usePlayerControl'
import playToPauseAnimationData from '@/util/lottie-assets/playpause.json'

const { toggle, playing, loadingTrack } = usePlayerControl()

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
  <v-btn :loading="loadingTrack" variant="text" icon size="large" @click="toggle">
    <lottie-icon
      v-show="!loadingTrack"
      class="lottie-icon"
      style="position: relative; left: -1.5px"
      :options="playOptions"
      :width="56"
      :height="56"
      @anim-created="handleAnimation"
    ></lottie-icon>
  </v-btn>
</template>
