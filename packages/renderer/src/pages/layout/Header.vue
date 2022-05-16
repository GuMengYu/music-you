<template>
  <v-app-bar class="app_header drag-area" elevate-on-scroll flat app>
    <div class="d-flex align-center">
      <b-f-btn />
      <reload-btn />
    </div>
    <div class="topbar-content-wrapper d-flex mx-2">
      <search-input />
    </div>
    <div class="append d-flex">
      <control-center-toggle />
      <Account />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import { useLayout } from 'vuetify'

import SearchInput from '@/components/toggle/SearchInput.vue'
const layout = useLayout()
console.log(layout)
</script>
<style scoped lang="scss">
.app_header {
  :deep(.v-toolbar__content) {
    justify-content: space-between;
    .topbar-content-wrapper {
      flex-grow: 1;
    }
  }
}
</style>
