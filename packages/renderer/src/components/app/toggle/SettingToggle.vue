<template>
  <v-btn icon @click="showSetting = !showSetting">
    <v-icon size="small">{{ mdiCogOutline }} </v-icon>
    <v-tooltip activator="parent" anchor="bottom">设置</v-tooltip>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiCogOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const { showSetting } = storeToRefs(useAppStore())
</script>
