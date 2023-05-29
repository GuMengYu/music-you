<template>
  <v-btn v-visible="!navLeft" icon class="no-drag-area" v-bind="$attrs" @click.prevent="back">
    <v-icon>
      {{ mdiArrowLeft }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiArrowLeft } from '@mdi/js'
import { useRouter } from 'vue-router'

import { useSettingStore } from '@/store/setting'
const router = useRouter()
const { navLeft } = useSettingStore()
async function back() {
  router.back()
}
</script>
