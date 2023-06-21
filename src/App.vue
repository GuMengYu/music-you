<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
<script setup lang="ts">
import useInForeground from '@/hooks/useInForeground'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
const player = usePlayer()

// space control
const { isActive: isInMv } = useInForeground('mv')
useEventListener(document, 'keydown', (e) => {
  const target = e.target as Element
  if (e.code === 'Space') {
    if (target.tagName !== 'BODY' || isInMv.value) return false
    e.preventDefault()
    player.togglePlay()
  }
})

const appStore = useAppStore()
appStore.init()
</script>
