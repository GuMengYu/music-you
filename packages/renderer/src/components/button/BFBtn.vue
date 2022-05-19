<template>
  <v-btn icon class="no-drag-area" @click.prevent="router.back()">
    <v-icon>
      {{ mdiChevronLeft }}
    </v-icon>
    <v-tooltip activator="parent" anchor="bottom">{{ $t('common.backward') }}</v-tooltip>
  </v-btn>
  <v-btn icon class="no-drag-area" @click.prevent="router.forward()">
    <v-icon>
      {{ mdiChevronRight }}
    </v-icon>
    <v-tooltip activator="parent" anchor="bottom">{{ $t('common.forward') }}</v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
