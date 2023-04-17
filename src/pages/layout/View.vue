<template>
  <v-main class="overflow-y-auto h-100">
    <v-container class="pa-4 pb-7" fluid>
      <router-view v-slot="{ Component }">
        <transition v-if="$route.meta['keepAlive']" name="route-animation" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
        <transition v-else name="route-animation" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-container>
    <back-to-top />
  </v-main>
</template>
<script setup lang="ts">
import 'overlayscrollbars/css/OverlayScrollbars.css'

import OverlayScrollbars from 'overlayscrollbars'
import { useTheme } from 'vuetify'

const theme = useTheme()

// watchEffect(() => {
//   const osTheme = theme.current.value.dark ? 'os-theme-light' : 'os-theme-dark'
//   const body = document.querySelectorAll('body')
//   OverlayScrollbars(body, {
//     className: osTheme,
//     scrollbars: {
//       autoHide: 'scroll',
//     },
//   })
// })
</script>
