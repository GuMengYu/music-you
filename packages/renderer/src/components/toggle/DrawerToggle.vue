<template>
  <v-btn icon class="no-drag-area" variant="text" @click="rail = !rail">
    <v-icon>
      {{ rail ? mdiMenu : mdiMenuOpen }}
    </v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { mdiMenu, mdiMenuOpen } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useSettingStore } from '@/store/setting'

const { rail } = storeToRefs(useSettingStore())
</script>
