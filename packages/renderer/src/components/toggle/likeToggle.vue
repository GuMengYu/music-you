<template>
  <v-btn flat icon size="small" :color="liked ? 'rgb(255, 76, 76)' : ''" @click="likeSong">
    <v-icon v-show="!state.showAnim" size="x-small" :color="liked ? 'rgb(255, 76, 76)' : ''">{{ mdiHeart }}</v-icon>
    <lottie-icon
      v-show="state.showAnim"
      ref="lottieIcon"
      :options="state.heartOptions"
      :height="40"
      :width="40"
      style="position: relative; left: -2px"
      @anim-created="handleAnimation"
    ></lottie-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiHeart } from '@mdi/js'
import type { AnimationItem } from 'lottie-web'
import { computed, reactive } from 'vue'

import { useUserStore } from '@/store/user'
import { heart } from '@/util/animationData.json'
import { sleep } from '@/util/fn'

const userStore = useUserStore()
const props = defineProps<{
  id?: number
}>()

interface RootState {
  showAnim: boolean
  heartAnim: AnimationItem | null
  heartOptions: {
    animationData: any
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
  return userStore.likes.includes(props.id!)
})
function handleAnimation(animation: AnimationItem) {
  state.heartAnim = animation
}
async function likeSong() {
  const _liked = liked.value
  const success = await userStore.favSong(props.id!, !liked.value)
  if (!_liked && success) {
    state.showAnim = true
    state.heartAnim?.goToAndPlay(0, true)
    await sleep(1000)
    state.showAnim = false
  }
}
</script>
