<script lang="ts" setup>
import { mdiChevronLeft } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { useRouter } from 'vue-router'

const ipcRenderer = useIpcRenderer()
const router = useRouter()
const { themeName } = useCurrentTheme()

function handleBack() {
  router.replace('/')
  ipcRenderer.invoke('minimal', false)
}
// coding here
</script>
<template>
  <v-app :theme="themeName" class="minimal">
    <media-card>
      <template #logo>
        <span></span>
        <v-icon color="primary" size="small" class="no-drag-area" @click="handleBack"> {{ mdiChevronLeft }} </v-icon>
      </template>
    </media-card>
  </v-app>
</template>
