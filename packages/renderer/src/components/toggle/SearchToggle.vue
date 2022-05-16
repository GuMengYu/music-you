<template>
  <v-btn icon @click="showCommandPalette = true">
    <v-icon>{{ mdiMagnify }} </v-icon>
    <v-tooltip activator="parent" anchor="bottom">打开CommandPalette</v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const { showCommandPalette } = storeToRefs(useAppStore())
</script>
