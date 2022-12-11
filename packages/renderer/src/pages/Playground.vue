<script lang="ts" setup>
import Comment from '@/components/comment/Comment.vue'
import { usePlayer } from '@/player/player'
const wave = ref()
const player = usePlayer()
</script>

<template>
  <v-container>
    <Comment :id="2829883282" type="playlist" />
  </v-container>
</template>
