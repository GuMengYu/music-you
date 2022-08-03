<script lang="ts" setup>
import { usePlayer } from '@/player/player'
const wave = ref()
const player = usePlayer()
</script>

<template>
  <v-container>
    <div ref="wave"></div>
  </v-container>
</template>
