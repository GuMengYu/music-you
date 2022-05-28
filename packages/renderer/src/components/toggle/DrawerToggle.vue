<template>
  <v-btn icon class="no-drag-area" variant="text" width="56" height="56" @click="rail = !rail">
    <v-icon>
      {{ mdiMenu }}
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiMenu } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useSettingStore } from '@/store/setting'

const { rail } = storeToRefs(useSettingStore())
</script>
