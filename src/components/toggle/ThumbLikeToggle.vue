<template>
  <v-btn
    :density="size === 'small' ? 'comfortable' : 'default'"
    variant="text"
    icon
    :color="_liked ? 'primary' : ''"
    @click="likeResource"
  >
    <v-icon :size="size === 'small' ? 'x-small' : 'small'" :color="_liked ? 'primary' : ''">{{
      liked ? mdiThumbUp : mdiThumbUpOutline
    }}</v-icon>
    <v-tooltip activator="parent" location="top"> {{ _liked ? '取消点赞' : '点赞' }} </v-tooltip>
  </v-btn>
</template>
<script setup lang="ts">
import { mdiThumbUp, mdiThumbUpOutline } from '@mdi/js'

import { resourceLike } from '@/api/music'
import type { RESOURCE_TYPE } from '@/util/enum'

const props = defineProps<{
  type: RESOURCE_TYPE
  id?: number
  size?: 'small' | 'default'
  liked?: boolean
}>()
const _liked = ref(false)
watch(
  () => props.id,
  (id) => {
    if (id) {
      _liked.value = !!props.liked
    }
  }
)
async function likeResource() {
  const { code } = await resourceLike(props.type, props.id!, _liked.value ? 0 : 1)
  if (code === 200) {
    _liked.value = !_liked.value
  }
}
</script>
