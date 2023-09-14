<template>
  <v-btn variant="flat" icon @click="toggleTheme">
    <LottieIcon
      ref="lottieIcon"
      class="lottie-icon onSurface--text"
      :options="state.modeOptions"
      :width="20"
      :height="20"
      style="position: relative; left: -1.5px"
      @anim-created="handleAnimation"
      @anim-updated="handleAnimationUpdated"
    />
  </v-btn>
</template>
<script setup lang="ts">
import type { AnimationItem } from 'lottie-web'
import { computed, reactive, ref, watchEffect } from 'vue'
import { useTheme } from 'vuetify'

import { APPEARANCE, useSettingStore } from '@/store/setting'
import darkToLight from '@/util/lottie-assets/darktolight.json'
import lightToDark from '@/util/lottie-assets/lighttodark.json'

const lottieIcon = ref<null>(null)
const state = reactive<{
  modeAnimation: AnimationItem | null
  modeOptions: {
    animationData: any
    loop: boolean
    autoplay: boolean
  }
}>({
  modeAnimation: null,
  modeOptions: {
    animationData: null,
    loop: false,
    autoplay: false,
  },
})

const settingStore = useSettingStore()
const theme = useTheme()
const isDark = computed((): boolean => {
  return theme.current.value.dark
})

watchEffect(
  () => {
    if (isDark.value) {
      animation(darkToLight)
    } else {
      animation(lightToDark)
    }
  },
  {
    flush: 'post',
  }
)

const handleAnimation = (animation: AnimationItem) => {
  state.modeAnimation = animation
}
const handleAnimationUpdated = (animation: AnimationItem) => {
  state.modeAnimation = animation
}
const animation = async (animationData: any) => {
  state.modeOptions.animationData = animationData
  lottieIcon.value?.update()
  state.modeAnimation?.goToAndPlay(0, false)
}
const toggleTheme = () => {
  settingStore.appearance = isDark.value ? APPEARANCE.LIGHT : APPEARANCE.DARK
}
</script>
