<script lang="ts" setup>
import { mdiCrystalBall, mdiEmoticon } from '@mdi/js'

const loading = ref(false)
</script>

<template>
  <v-container>
    <v-btn icon color="primary" :loading="loading">
      <v-icon>
        {{ mdiCrystalBall }}
      </v-icon>
    </v-btn>

    <v-btn @click="loading = !loading"> toggle </v-btn>
  </v-container>
</template>
