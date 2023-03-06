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
const { xs } = useDisplay()

const fullscreen = ref(false)

const currentComponent = computed(() => {
  const component = {
    [PLAYING_MODE.SIMPLE]: simple,
    [PLAYING_MODE.MD]: md,
  }[settingStore.playingMode]
  if (xs.value) {
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
    <keep-alive>
      <component :is="currentComponent" />
    </keep-alive>
  </v-dialog>
</template>
