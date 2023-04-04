<template>
  <v-btn icon class="no-drag-area" v-bind="$attrs" @click.prevent="back">
    <v-icon>
      {{ mdiArrowLeft }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiArrowLeft } from '@mdi/js'
import { useRouter } from 'vue-router'
const router = useRouter()
async function back() {
  router.back()
}
</script>
