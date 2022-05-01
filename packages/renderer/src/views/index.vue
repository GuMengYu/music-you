<template>
  <v-app class="v-player" :theme="theme">
    <app-setting />
    <app-nav />
    <app-header />
    <app-content class="v-player-content" />
    <app-footer />
    <app-login />
    <playing-list />
    <!--
    <default-setting />
    <playing-page />
    <default-login />
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" /> -->
    <app-playing-page />
    <app-search />
    <app-toast />
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from '@/hooks/theme'

import AppFooter from '../components/app/Footer.vue'
import AppHeader from '../components/app/Header.vue'
import AppLogin from '../components/app/Login.vue'
import AppNav from '../components/app/Navbar.vue'
import PlayingList from '../components/app/nowPlaying/list.vue'
import AppSearch from '../components/app/search/Search.vue'
import AppSetting from '../components/app/setting/index.vue'
import AppToast from '../components/app/toast/Toast.vue'
import AppContent from '../components/layout/View.vue'
import AppPlayingPage from '../components/app/nowPlaying/mode/index.vue'
const theme = useTheme()
</script>
