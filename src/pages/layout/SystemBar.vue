<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'

// import WindowControl from '@/components/layout/WindowControl.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()
const { windowState, platformType } = storeToRefs(appStore)

const title = useTitle(void 0, { observe: true })
const { mdAndUp } = useDisplay()

const height = computed(() => {
  return platformType.value === 'Darwin' ? 6 : void 0
})
// coding here
</script>
<template>
  <v-system-bar :height="height" class="drag-area px-0" color="surface">
    <span class="ml-4 line-clamp-1 w-75 text-left">
      {{ title }}
    </span>

    <v-spacer></v-spacer>

    <!-- <WindowControl v-if="isShowWindowControl" /> -->
  </v-system-bar>
</template>
