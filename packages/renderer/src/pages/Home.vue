<template>
  <v-app class="v-player">
    <AppCC />
    <!-- <app-system-bar v-if="is.electron()" class="v-player-header" /> -->
    <app-nav v-if="mdAndUp" class="v-player-nav" />
    <app-header class="v-player-header" />

    <app-content class="v-player-content" />
    <app-playbar v-if="mdAndUp" />
    <app-mobile-playbar v-else />
    <app-bottom-nav v-if="smAndDown" />
    <app-login />
    <app-playing-page />
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay, useTheme } from 'vuetify'

import { useCurrentTheme } from '@/hooks/useTheme'
import is from '@/util/is'

import AppBottomNav from './layout/BottomNav.vue'
import AppCC from './layout/CC.vue'
import AppPlaybar from './layout/Footer.vue'
import AppHeader from './layout/Header.vue'
import AppMobilePlaybar from './layout/MobilePlaybar.vue'
import AppNav from './layout/Navbar.vue'
import AppSystemBar from './layout/SystemBar.vue'
import AppContent from './layout/View.vue'
import AppLogin from './modal/Login.vue'
import AppPlayingPage from './mode/index.vue'
const { themeName } = useCurrentTheme()
const display = useDisplay()
const { smAndUp, mdAndUp, smAndDown } = display
const theme = useTheme()
watchEffect(() => {
  theme.global.name.value = themeName.value
})
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
      .v-list-item {
        text-align: center;
        &:hover .v-icon {
          animation: bounce 1s;
        }
      }
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
  transition-property: left, width;
  transition-duration: $transition-time;
  transition-timing-function: $cubic-bezier;
}
</style>
