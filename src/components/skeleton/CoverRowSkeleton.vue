<template>
  <div class="row-skeleton">
    <v-skeleton-loader v-if="heading" type="heading" class="my-4" width="300" />
    <carousel :gridStyle="grid">
      <v-skeleton-loader :type="type" v-for="n in cols" :key="n" />
    </carousel>
  </div>
</template>

<script>
import Carousel from '@components/layout/Carousel.vue';
export default {
  components: { Carousel },
  name: 'CoverRowSkeleton',
  props: {
    type: {
      type: String,
      default: 'card',
    },
    heading: {
      type: Boolean,
      default: false,
    },
    grid: {
      type: String,
      default: 'B',
    },
    cols: {
      type: Number,
      default: 6,
    },
  },
};
</script>
<style scoped lang="scss">
.row-skeleton {
  ::v-deep .v-skeleton-loader__avatar {
    height: 150px;
    width: 150px;
  }
}
</style>
