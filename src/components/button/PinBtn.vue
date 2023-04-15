<template>
  <v-btn icon class="no-drag-area" v-bind="$attrs" variant="tonal" color="secondary" @click.prevent="handlePin">
    <v-icon size="small">
      {{ mdiPinOutline }}
    </v-icon>
    <v-tooltip activator="parent" location="top">添加到首页快捷卡片</v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiPinOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

import type { shortcutType } from '@/store/homeConfig'
import { useHomeConfigStore } from '@/store/homeConfig'
const { pinPlaylist } = storeToRefs(useHomeConfigStore())
const toast = useToast()
const props = defineProps<{
  data: any
  type: shortcutType
}>()
async function handlePin() {
  if (props.data.id) {
    pinPlaylist.value = {
      id: props.data['id'],
      title: props.data['name'],
      picUrl: props.data['coverImgUrl'] ?? props.data['picUrl'],
      type: props.type,
    }
    toast.success('pined')
  }
}
</script>
