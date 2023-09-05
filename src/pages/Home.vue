<template>
  <v-app class="v-player" :class="{ 'is-desktop': isDesktop }">
    <AppCC />
    <app-nav v-if="smAndUp && navPosition === NavPosition.left" class="v-player-nav" />
    <app-header v-if="!inDeepPage && navPosition === NavPosition.top" class="v-player-header" />
    <v-app-bar v-if="!inDeepPage && navPosition === NavPosition.left" height="20" flat></v-app-bar>
    <app-content id="v-player-content" class="v-player-content" />
    <v-app-bar v-if="miniPlayer" height="4" flat location="bottom"></v-app-bar>

    <app-playbar v-if="smAndUp && !miniPlayer" />
    <app-mobile-playbar v-if="xs" />
    <app-bottom-nav v-if="xs" />
    <app-login />
    <app-playing-page />
    <window-control v-if="isShowWindowControl" />
    <transition name="slide-fade-y">
      <mini-player-bar v-if="miniPlayer" />
    </transition>
  </v-app>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDisplay, useTheme } from 'vuetify'

import useInForeground from '@/hooks/useInForeground'
import { useCurrentTheme } from '@/hooks/useTheme'
import MiniPlayerBar from '@/pages/layout/MiniPlayerBar.vue'
import { NavPosition, useSettingStore } from '@/store/setting'
import is from '@/util/is'

import AppBottomNav from './layout/BottomNav.vue'
import AppCC from './layout/CC.vue'
import AppPlaybar from './layout/Footer.vue'
import AppHeader from './layout/Header.vue'
import AppMobilePlaybar from './layout/MobilePlaybar.vue'
import AppNav from './layout/Navbar.vue'
import AppContent from './layout/View.vue'
import AppLogin from './modal/Login.vue'
import AppPlayingPage from './mode/index.vue'

const { themeName } = useCurrentTheme()
const { miniPlayer, navPosition } = storeToRefs(useSettingStore())
const display = useDisplay()
const { xs, smAndUp } = display
const theme = useTheme()
watchEffect(() => {
  theme.global.name.value = themeName.value
})
const isShowWindowControl = computed(() => {
  return (is.windows() || is.linux()) && smAndUp.value && navPosition.value === NavPosition.left
})
const isDesktop = computed(() => {
  return is.electron()
})
const { isActive: inDeepPage } = useInForeground(['podcast', 'playlist', 'album', 'artist', 'search', 'video', 'daily'])
</script>
<style lang="scss">
$cubic-bezier: cubic-bezier(0.55, -0.01, 0, 1.03);
$transition-time: 350ms;
.v-player-nav {
  border-inline-end-width: 0;
  transition-property: width;
  transition-duration: $transition-time;
  transition-timing-function: $cubic-bezier;
  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
  .content-warp {
    display: flex;
    flex-direction: column;
    .list-content {
      flex: initial;
      transition: flex $transition-time $cubic-bezier;
      //.v-list-item {
      //  &:hover .v-icon {
      //    animation: bounce 1s;
      //  }
      //}
    }
    &.rail-nav {
      .list-content {
        flex: auto;
      }
    }
  }
}
.v-player-content {
  transition: padding $transition-time $cubic-bezier;
}
.v-player-header {
  transition-property: left, width;
  transition-duration: $transition-time;
  transition-timing-function: $cubic-bezier;
}
.is-desktop {
  user-select: none;
}
.v-player {
  border-radius: 28px;
  border: 8px solid rgba(var(--v-theme-primary), 0.2);
  transform: scale(1);
  height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  //width: 100vw;
  .v-application__wrap {
    min-height: initial !important;
  }
}
</style>
