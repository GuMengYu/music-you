<template>
  <v-app-bar class="app_header drag-area" elevate-on-scroll flat app>
    <div class="d-flex align-center">
      <b-f-btn />
      <reload-btn />
    </div>
    <div class="topbar-content-wrapper d-flex">
      <search-input />
    </div>
    <div class="append d-flex">
      <control-center-toggle />
      <account />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import Account from './Account.vue'
import BFBtn from './button/BFBtn.vue'
import ReloadBtn from './button/ReloadBtn.vue'
import ControlCenterToggle from './toggle/ControlCenterToggle.vue'
import SearchInput from './toggle/SearchInput.vue'
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
