<template>
  <v-dialog v-model="showLyric" fullscreen transition="dialog-bottom-transition">
    <component :is="component" />
  </v-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'

import { useAppStore } from '@/store/app'

import { basic, simple } from './exports'

const appStore = useAppStore()

const { showLyric, playingMode } = storeToRefs(appStore)

const fullscreen = ref(false)

const component = computed(() => {
  return playingMode.value === 'simple' ? simple : basic
})

onMounted(() => {
  document.documentElement.onfullscreenchange = onfullscreenchange
})

function onfullscreenchange(event) {
  fullscreen.value = document.fullscreenElement === event.target
}
</script>
