<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useAppStore } from '@/store/app'

import { basic, simple } from './exports'

const appStore = useAppStore()

const { showLyric, playingMode } = storeToRefs(appStore)

const fullscreen = ref(false)

const currentComponent = computed(() => {
  return playingMode.value === 'simple' ? simple : basic
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
