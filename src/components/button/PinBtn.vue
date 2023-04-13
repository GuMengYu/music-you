<template>
  <v-btn icon class="no-drag-area" v-bind="$attrs" variant="tonal" color="secondary" @click.prevent="back">
    <v-icon>
      {{ mdiPinOutline }}
    </v-icon>
    <v-tooltip activator="parent" location="top">添加到首页快捷卡片</v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiPinOutline } from '@mdi/js'
import { useRouter } from 'vue-router'
const router = useRouter()
async function back() {
  router.back()
}
</script>
