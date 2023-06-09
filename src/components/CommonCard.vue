<template>
  <v-card class="common-card" flat :rounded="rounded" :width="$attrs.width" :color="$attrs.color">
    <v-toolbar dense flat :color="$attrs.color" rounded>
      <v-toolbar-title class="text-caption text-onSurfaceVariant">{{ title }}</v-toolbar-title>
      <v-spacer />
      <slot name="appendCard"></slot>
      <v-btn icon size="small">
        <v-icon size="x-small"> {{ mdiDotsVertical }} </v-icon>
      </v-btn>
    </v-toolbar>
    <slot />
  </v-card>
</template>

<script>
import { mdiDotsVertical } from '@mdi/js'

export default {
  name: 'CommonCard',
  props: {
    title: {
      type: String,
      default: '推荐歌曲',
    },
    rounded: {
      type: String,
      default: 'lg',
    },
  },
  data() {
    return {
      mdiDotsVertical,
    }
  },
}
</script>
