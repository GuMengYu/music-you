<template>
  <v-btn icon class="no-drag-area" @click.prevent="back">
    <v-icon>
      {{ mdiChevronLeft }}
    </v-icon>
  </v-btn>
  <v-btn icon class="no-drag-area" @click.prevent="forward">
    <v-icon>
      {{ mdiChevronRight }}
    </v-icon>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { useRouter } from 'vue-router'
const router = useRouter()
async function back() {
  router.back()
}
async function forward() {
  router.forward()
}
</script>
