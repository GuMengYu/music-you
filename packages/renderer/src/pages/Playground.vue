<script lang="ts" setup>
import { mdiCrystalBall, mdiEmoticon } from '@mdi/js'

const loading = ref(false)
</script>

<template>
  <v-container>
    <v-square-btn>
      <v-icon>
        {{ mdiCrystalBall }}
      </v-icon>
    </v-square-btn>
  </v-container>
</template>
