<template>
  <v-btn icon @click="showControlCenter = !showControlCenter">
    <v-icon size="small">{{ mdiCorn }} </v-icon>
    <v-tooltip activator="parent" anchor="bottom">CC</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiCorn } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const { showControlCenter } = storeToRefs(useAppStore())
</script>
