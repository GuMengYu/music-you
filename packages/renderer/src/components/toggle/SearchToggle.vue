<template>
  <v-btn icon @click="showSearch = !showSearch">
    <v-icon size="small">{{ mdiMagnify }} </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const { showSearch } = storeToRefs(useAppStore())
</script>
