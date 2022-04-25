<template>
  <v-btn flat icon size="small" @click="likeSong">
    <v-icon v-show="!state.showAnim" size="x-small" :color="liked ? 'rgb(255, 76, 76)' : ''">{{ mdiHeart }}</v-icon>
    <lottie-icon
      v-show="state.showAnim"
      ref="lottieIcon"
      :options="state.heartOptions"
      :height="40"
      :width="40"
      @animCreated="handleAnimation"
    ></lottie-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiHeart } from '@mdi/js'
import type { AnimationItem } from 'lottie-web'
import { computed, reactive } from 'vue'

import LottieIcon from '../../LottieIcon.vue'
import { usePlayerStore } from '../../../store/player'
import { heart } from '../../../util/animationData.json'
import { sleep } from '../../../util/fn'

const playerStore = usePlayerStore()
const props = defineProps({
  id: Number,
})

type RootState = {
  showAnim: boolean
  heartAnim: AnimationItem | null
  heartOptions: {
    animationData: null | {}
    loop: boolean
    autoplay: boolean
  }
}
const state = reactive<RootState>({
  heartAnim: null,
  showAnim: false,
  heartOptions: {
    animationData: heart,
    loop: false,
    autoplay: false,
  },
})

const liked = computed(() => {
  return playerStore.likes.includes(props.id)
})
function handleAnimation(animation: AnimationItem) {
  state.heartAnim = animation
}
async function likeSong() {
  const _liked = liked.value
  const success = await playerStore.toggleFavorite({
    id: props.id,
    like: !liked.value,
  })
  if (!_liked && success) {
    state.showAnim = true
    state.heartAnim?.goToAndPlay(0, true)
    await sleep(1000)
    state.showAnim = false
  }
}
</script>
