<template>
  <v-btn
    :density="size === 'small' ? 'comfortable' : 'default'"
    variant="text"
    icon
    :color="liked ? color ?? 'error' : ''"
    :size="size"
    @click="likeSong"
  >
    <v-icon v-show="!state.showAnim" :size="size" :color="liked ? color ?? 'error' : ''">{{
      liked ? mdiHeart : mdiHeartOutline
    }}</v-icon>
    <lottie-icon
      v-show="state.showAnim"
      ref="lottieIcon"
      :options="state.heartOptions"
      :height="size === 'small' ? 31 : 51"
      :width="size === 'small' ? 31 : 51"
      :style="{ position: 'relative', top: '-1.5px', left: size === 'small' ? '-1px' : '-1.5px' }"
      @anim-created="handleAnimation"
    ></lottie-icon>
    <v-tooltip activator="parent" location="top"> {{ t('common.fav', liked ? 0 : 1) }} </v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiHeartOutline } from '@mdi/js'
import type { AnimationItem } from 'lottie-web'
import { useI18n } from 'vue-i18n'

import { useUserStore } from '@/store/user'
import { sleep } from '@/util/fn'
import { mdiHeart } from '@/util/icons'
import heart from '@/util/lottie-assets/heart.json'
const { t } = useI18n()

const userStore = useUserStore()
const props = defineProps<{
  id?: number
  size?: 'small' | 'default'
  color?: string
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
