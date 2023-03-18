<template>
  <v-btn v-if="showComment" icon variant="text" @click="show = true">
    <v-icon size="small">
      {{ mdiCommentOutline }}
    </v-icon>
  </v-btn>
  <MusicComment v-if="showComment" :id="id" v-model:show="show" />
</template>

<script setup lang="ts">
import { mdiCommentOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const { comment: showComment } = storeToRefs(settingStore)

const props = defineProps<{
  id: number
}>()
const show = ref<boolean>(false)
</script>
