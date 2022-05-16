<template>
  <v-app class="v-player" :theme="theme">
    <AppCC />
    <app-nav class="v-player-nav" />
    <app-header class="v-player-header" />
    <app-content class="v-player-content" />
    <app-footer />
    <app-login />
    <!--
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" /> -->
    <app-playing-page />
    <app-toast />
  </v-app>
</template>

<script setup lang="ts">
import AppToast from '@/components/Toast.vue'
import { useTheme } from '@/hooks/useTheme'

import AppCC from './layout/CC.vue'
import AppFooter from './layout/Footer.vue'
import AppHeader from './layout/Header.vue'
import AppNav from './layout/Navbar.vue'
import AppContent from './layout/View.vue'
import AppLogin from './modal/Login.vue'
import AppPlayingPage from './mode/index.vue'
const theme = useTheme()
</script>
<style lang="scss">
$cubic-bezier: cubic-bezier(0.55, -0.01, 0, 1.03);
$transition-time: 0.6s;
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
    }
    // justify-content not the transition property, so use block 'flex' property 'auto' to make it work
    .list-dummy {
      flex: auto;
      transition: flex $transition-time $cubic-bezier;
    }
    &.rail-nav {
      .list-dummy {
        flex: 0;
      }
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
  transition-property: margin, width;
  transition-duration: $transition-time;
  transition-timing-function: $cubic-bezier;
}
</style>
