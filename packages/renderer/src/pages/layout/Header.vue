<template>
  <v-app-bar class="app_header drag-area" elevate-on-scroll flat app>
    <div class="d-flex align-center">
      <b-f-btn />
      <reload-btn />
    </div>
    <div class="topbar-content-wrapper d-flex mx-2 no-drag-area">
      <search-input />
    </div>
    <div class="append d-flex no-drag-area">
      <control-center-toggle />
      <Account />
      <window-control v-if="isShowWindowControl" />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import SearchInput from '@/components/toggle/SearchInput.vue'
import is from '@/util/is'
const isShowWindowControl = computed(() => {
  return is.windows() || is.linux()
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
