<template>
  <v-sheet>
    <h1
      class="text-md-h5 text-sm-body-1 mt-4"
      :title="title"
    />
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
}
</script>
