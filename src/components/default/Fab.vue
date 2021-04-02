<template>
  <v-progress-circular
    :indeterminate="loading"
    color="primary"
    :size="size + 4"
  >
    <v-btn
      color="primary"
      :width="size"
      :height="size"
      fab
      elevation="0"
      class="fab-btn"
      :class="{ 'fab-hover': hover }"
      @click.prevent="play"
    >
      <slot></slot>
    </v-btn>
  </v-progress-circular>
</template>

<script>
export default {
  name: 'DefaultFab',
  props: {
    loading: Boolean,
    size: {
      type: Number,
      default: 48,
    },
    hover: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    play() {
      this.$emit('fab-click');
    },
  },
};
</script>

<style scoped lang="scss">
.fab-hover {
  backdrop-filter: blur(30px) brightness(90%);
  background: transparent;
}
.v-progress-circular {
  ::v-deep .v-progress-circular__underlay {
    stroke: none;
  }
}
</style>
