<script setup lang="ts">
import { mdiDownload } from '@mdi/js'

import { useDownload } from '@/hooks/useDownload'
const props = defineProps<{
  url: string
  fileName?: string
  tooltip?: string
}>()
function download() {
  if (props.url) {
    useDownload(props.url, props.fileName)
  }
}
</script>
<template>
  <v-btn icon variant="text" @click="download">
    <v-icon size="small">
      {{ mdiDownload }}
    </v-icon>
    <v-tooltip v-if="tooltip" activator="parent" location="top"> {{ tooltip }} </v-tooltip>
  </v-btn>
</template>
