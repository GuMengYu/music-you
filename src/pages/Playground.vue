<script lang="ts" setup>
import { mdiHeart, mdiHeartOutline } from '@mdi/js'
</script>

<template>
  <v-container>
    <div :style="{ height: '200px', width: '200px' }">
      <LikeToggle :id="0" size="small" />
      <v-btn density="comfortable" variant="text" icon size="small"
        ><v-icon size="small">{{ mdiHeart }}</v-icon></v-btn
      >
      <LikeToggle :id="0" />
      <v-icon>{{ mdiHeartOutline }}</v-icon>
    </div>
  </v-container>
</template>
