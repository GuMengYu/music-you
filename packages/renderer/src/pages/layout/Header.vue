<template>
  <v-app-bar class="app_header drag-area" flat :height="80">
    <div v-if="mdAndUp" class="d-flex align-center">
      <b-f-btn />
      <reload-btn />
    </div>
    <div class="topbar-content-wrapper d-flex justify-end">
      <!-- <v-divider vertical class="ma-3 mr-5" /> -->
      <search-input class="no-drag-area" />
    </div>
    <div v-if="mdAndUp" class="append d-flex no-drag-area ml-2 align-center">
      <control-center-toggle />
      <window-control v-if="isShowWindowControl" />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import { useDisplay } from 'vuetify'

import SearchInput from '@/components/toggle/SearchInput.vue'
import is from '@/util/is'
const { smAndUp, mdAndUp, lgAndUp } = useDisplay()
const isShowWindowControl = computed(() => {
  return (is.windows() || is.linux()) && mdAndUp.value
})
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
