<template>
  <v-card class="common-card" flat :rounded="rounded" :width="$attrs.width">
    <v-app-bar dense flat :color="$attrs.color">
      <v-app-bar-title class="text-caption onSurfaceVariant--text">{{
        title
      }}</v-app-bar-title>
      <v-spacer />
      <slot name="appendCard"></slot>
      <v-btn color="onSurfaceVariant" icon small>
        <v-icon small> {{ mdiDotsVertical }} </v-icon>
      </v-btn>
    </v-app-bar>
    <slot />
  </v-card>
</template>

<script>
import { mdiDotsVertical } from '@mdi/js';

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
    };
  },
};
</script>

<style scoped></style>
