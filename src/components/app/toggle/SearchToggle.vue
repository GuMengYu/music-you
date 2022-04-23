<template>
  <v-btn icon @click="showSearch = true">
    <v-icon>{{ mdiMagnify }} </v-icon>
    <v-tooltip activator="parent" anchor="bottom">打开搜索</v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiMagnify } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const { showSearch } = storeToRefs(useAppStore())
</script>
