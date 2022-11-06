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
import { mdiMenuDown } from '@/util/icons'
const { showControlCenter } = storeToRefs(useAppStore())
</script>
