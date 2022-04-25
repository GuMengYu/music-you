<template>
  <v-app-bar class="app_header drag-area" elevate-on-scroll flat app>
    <template #prepend>
      <div>
        <drawer-toggle />
      </div>
    </template>
    <b-f-btn />
    <reload-btn />
    <theme-toggle />
    <setting-toggle />
    <account />
  </v-app-bar>
</template>
<script setup lang="ts">
import Account from './Account.vue'
import BFBtn from './button/BFBtn.vue'
import ReloadBtn from './button/ReloadBtn.vue'
import DrawerToggle from './toggle/DrawerToggle.vue'
import SettingToggle from './toggle/SettingToggle.vue'
import ThemeToggle from './toggle/ThemeToggle.vue'
</script>
<style scoped lang="scss">
.app_header {
  padding-inline-start: 12px;
}
</style>
