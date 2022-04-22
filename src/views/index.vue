<template>
  <v-app class="v-player" :theme="theme">
    <app-setting />
    <app-header />
    <app-nav />
    <app-content class="v-player-content" />
    <app-footer />
    <app-login />
    <!--
    <player-bar />
    <default-setting />
    <playing-page />
    <default-login />
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" /> -->
  </v-app>
</template>

<script setup lang="ts">
import AppFooter from '@/components/app/Footer.vue'
import AppHeader from '@/components/app/Header.vue'
import AppLogin from '@/components/app/Login.vue'
import AppNav from '@/components/app/Navbar.vue'
import AppSetting from '@/components/app/setting/index.vue'
import AppContent from '@/components/layout/View.vue'
import { useTheme } from '@/hooks/theme'

const theme = useTheme()
</script>
