<template>
  <v-app-bar class="app_header drag-area" elevate-on-scroll flat app>
    <template #prepend>
      <div>
        <drawer-toggle />
      </div>
    </template>
    <v-app-bar-title>
      <v-img :src="logo" alt="v-player" max-width="36" />
    </v-app-bar-title>
    <b-f-btn />
    <reload-btn />
    <theme-toggle />
    <setting-toggle />
    <account />
  </v-app-bar>
</template>
<script setup lang="ts">
import Account from '@/components/app/Account.vue'
import BFBtn from '@/components/app/button/BFBtn.vue'
import ReloadBtn from '@/components/app/button/ReloadBtn.vue'
import DrawerToggle from '@/components/app/toggle/DrawerToggle.vue'
import SettingToggle from '@/components/app/toggle/SettingToggle.vue'
import ThemeToggle from '@/components/app/toggle/ThemeToggle.vue'
import logo from '@/assets/icons/128x128.png'
</script>
<style scoped lang="scss">
.app_header {
  padding-inline-start: 12px;
}
</style>
