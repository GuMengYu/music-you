<template>
  <v-btn icon class="no-drag-area" @click="reload()">
    <v-icon size="small">
      {{ mdiReload }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiReload } from '@mdi/js'
function reload() {
  window?.location.reload()
}
</script>
