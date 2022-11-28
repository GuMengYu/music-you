<template>
  <v-btn icon @click="showControlCenter = !showControlCenter">
    <v-icon size="small">{{ mdiEggFried }} </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiEggFried } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'
const { showControlCenter } = storeToRefs(useAppStore())
</script>
