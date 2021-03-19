<template>
  <v-sheet>
    <h2 class="text-md-h5 text-sm-body-1 font-weight-bold mb-4" :title="title">
      {{ title }}
    </h2>
    <slot />
  </v-sheet>
</template>

<script>
// todo: 统一页面页头
export default {
  name: 'Page',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>
