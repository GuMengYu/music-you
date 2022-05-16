<template>
  <v-app class="v-player" :theme="theme">
    <AppCC />
    <app-nav />
    <app-header />
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
import { useTheme } from '@/hooks/theme'

import AppCC from './layout/CC.vue'
import AppFooter from './layout/Footer.vue'
import AppHeader from './layout/Header.vue'
import AppNav from './layout/Navbar.vue'
import AppContent from './layout/View.vue'
import AppLogin from './modal/Login.vue'
import AppPlayingPage from './mode/index.vue'
const theme = useTheme()
</script>
