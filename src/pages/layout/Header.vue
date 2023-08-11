<template>
  <v-app-bar class="app_header drag-area" flat>
    <div class="d-flex flex-grow-1 mr-2 ml-2 align-center">
      <div class="logo" style="flex: 1">
        <aggregate-extend-btn variant="default" />
      </div>
      <transition name="slide-fade-y">
        <top-navbar />
      </transition>
      <div v-if="smAndUp" class="d-flex align-center justify-end" style="flex: 1">
        <account class="no-drag-area" />
      </div>
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

import SearchInput from '@/components/toggle/SearchInput.vue'
import useInForeground from '@/hooks/useInForeground'
import TopNavbar from '@/pages/layout/TopNavbar.vue'
import { useAppStore } from '@/store/app'
import { useSettingStore } from '@/store/setting'
import is from '@/util/is'
const router = useRouter()
const { smAndUp } = useDisplay()
const { showSearch } = storeToRefs(useAppStore())

const isShowWindowControl = computed(() => {
  return (is.windows() || is.linux()) && smAndUp.value
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
