<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useAppStore } from '@/store/app'
import { useSettingStore } from '@/store/setting'
import { PLAYING_MODE } from '@/util/enum'

import { basic, md, simple } from './exports'

const appStore = useAppStore()
const settingStore = useSettingStore()
const { showLyric } = storeToRefs(appStore)

const fullscreen = ref(false)

const currentComponent = computed(() => {
  return {
    [PLAYING_MODE.SIMPLE]: simple,
    [PLAYING_MODE.BASIC]: basic,
    [PLAYING_MODE.MD]: md,
  }[settingStore.playingMode]
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
