<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'

import { useAppStore } from '@/store/app'
import { useSettingStore } from '@/store/setting'
import { PLAYING_MODE } from '@/util/enum'

import { md, mobile, simple, visual } from './exports'

const appStore = useAppStore()
const settingStore = useSettingStore()
const { showLyric } = storeToRefs(appStore)
const { smAndDown } = useDisplay()

const fullscreen = ref(false)

const currentComponent = computed(() => {
  const component = {
    [PLAYING_MODE.SIMPLE]: simple,
    [PLAYING_MODE.MD]: md,
  }[settingStore.playingMode]
  if (smAndDown.value) {
    return mobile
  } else if (settingStore.visualization) {
    return visual
  } else {
    return component
  }
})

onMounted(() => {
  document.documentElement.onfullscreenchange = onfullscreenchange
})

function onfullscreenchange(event: Event) {
  fullscreen.value = document.fullscreenElement === event.target
}
</script>
<template>
  <v-dialog v-model="showLyric" fullscreen transition="dialog-bottom-transition" :scrim="false">
    <component :is="currentComponent" />
  </v-dialog>
</template>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.3s cubic-bezier(0.55, -0.01, 0, 1.03);
}
</style>
