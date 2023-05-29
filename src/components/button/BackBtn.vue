<template>
  <v-btn v-visible="navPosition === NavPosition.top" icon class="no-drag-area" v-bind="$attrs" @click.prevent="back">
    <v-icon>
      {{ mdiArrowLeft }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiArrowLeft } from '@mdi/js'
import { useRouter } from 'vue-router'

import { NavPosition, useSettingStore } from '@/store/setting'
const router = useRouter()
const { navPosition } = useSettingStore()
async function back() {
  router.back()
}
</script>
