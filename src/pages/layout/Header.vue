<template>
  <v-app-bar class="app_header drag-area" flat height="56">
    <div v-show="mdAndUp && !searchInputVisible" class="d-flex align-center">
      <b-f-btn />
      <reload-btn />
    </div>
    <div class="topbar-content-wrapper d-flex ml-2" :class="mdAndUp ? 'justify-start' : 'justify-center'">
      <!-- <v-divider vertical class="ma-3 mr-5" /> -->
      <transition name="slide-fade-x">
        <search-input v-if="searchInputVisible" class="no-drag-area" />
      </transition>
    </div>
    <div v-if="mdAndUp" class="d-flex no-drag-area mx-1 align-center">
      <search-toggle v-show="!searchInputVisible" />
      <control-center-toggle />
      <account />
      <window-control v-if="isShowWindowControl" />
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'

import SearchInput from '@/components/toggle/SearchInput.vue'
import useInForeground from '@/hooks/useInForeground'
import { useAppStore } from '@/store/app'
import is from '@/util/is'
const { mdAndUp } = useDisplay()
const { showSearch } = storeToRefs(useAppStore())
const isShowWindowControl = computed(() => {
  return (is.windows() || is.linux()) && mdAndUp.value
})
const { isActive: inSearchPage } = useInForeground('search')

const searchInputVisible = computed(() => {
  return inSearchPage.value || showSearch.value
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
