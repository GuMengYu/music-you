<template>
  <div>
    <v-skeleton-loader type="heading" class="my-4" width="300" />
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
