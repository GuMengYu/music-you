<script lang="ts" setup>
import { mdiCrystalBall, mdiEmoticon } from '@mdi/js'

const loading = ref(false)
const items = [
  { text: 'Real-Time', icon: mdiEmoticon },
  { text: 'Audience', icon: 'mdi-account' },
  { text: 'Conversions', icon: 'mdi-flag' },
]
</script>

<template>
  <v-container>
    <v-list>
      <v-list-subheader>
        <v-icon>{{ mdiCrystalBall }}</v-icon>
      </v-list-subheader>
      <v-list-item v-for="(item, i) in items" :key="i" :value="i" active-color="primary">
        <v-list-item-avatar start>
          <v-icon :icon="item.icon"></v-icon>
        </v-list-item-avatar>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>
