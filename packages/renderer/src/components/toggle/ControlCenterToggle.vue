<template>
  <v-btn
    icon
    variant="tonal"
    rounded="lg"
    color="primary"
    density="comfortable"
    @click="showControlCenter = !showControlCenter"
  >
    <v-icon size="24">{{ mdiMenuDown }} </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'
const { showControlCenter } = storeToRefs(useAppStore())
const mdiMenuDown =
  'M8.71005 11.71L11.3001 14.3C11.6901 14.69 12.3201 14.69 12.7101 14.3L15.3001 11.71C15.9301 11.08 15.4801 10 14.5901 10H9.41005C8.52005 10 8.08005 11.08 8.71005 11.71Z'
</script>
