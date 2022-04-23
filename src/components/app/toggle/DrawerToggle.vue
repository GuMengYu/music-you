<template>
  <v-btn icon @click="rail = !rail" class="no-drag-area">
    <v-icon>
      {{ mdiMenu }}
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiMenu } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/store/app'

const { rail } = storeToRefs(useAppStore())
</script>
