<template>
  <v-btn icon class="no-drag-area" v-bind="$attrs" @click.prevent="minimal">
    <v-icon size="small">
      {{ mdiCreditCardChipOutline }}
    </v-icon>
    <v-tooltip activator="parent" location="top" open-delay="100"> 小窗播放 </v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiCreditCardChipOutline } from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { useRouter } from 'vue-router'

const ipcRenderer = useIpcRenderer()

const router = useRouter()
async function minimal() {
  await ipcRenderer.invoke('minimal', true)
  await router.push('/minimal')
}
</script>
