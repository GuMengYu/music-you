<template>
  <v-main class="overflow-y-auto h-100">
    <v-container class="pa-4 pt-5 pb-7 drag-area" fluid>
      <router-view v-slot="{ Component }">
        <transition v-if="$route.meta['keepAlive']" name="route-animation" mode="out-in">
          <keep-alive>
            <component :is="Component" class="no-drag-area" />
          </keep-alive>
        </transition>
        <transition v-else name="route-animation" mode="out-in">
          <component :is="Component" class="no-drag-area" />
        </transition>
      </router-view>
    </v-container>
    <back-to-top />
  </v-main>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { NavPosition, useSettingStore } from '@/store/setting'

const { navPosition, miniPlayer } = storeToRefs(useSettingStore())

// const marginTopClass = computed(() => (navPosition.value === NavPosition.top ? 'mt-0' : 'mt-4'))
// const containerStyle = computed(() => {
//   let height = navPosition.value === NavPosition.top ? 168 : 120
//   if (miniPlayer.value) {
//     height -= 74 // 减去播放栏高度
//   }
//   return {
//     height: `calc(100vh - ${height}px)`,
//   }
// })
</script>
