<template>
  <div>
    <v-skeleton-loader type="heading" width="270" class="my-4" />
    <carousel grid-style="A">
      <carousel-item v-for="i in 4" :key="i">
        <v-skeleton-loader type="heading" class="my-2" />
        <v-skeleton-loader type="image" class="release" />
      </carousel-item>
    </carousel>
    <v-skeleton-loader type="heading" width="270" class="my-4" />
    <carousel>
      <carousel-item v-for="i in 6" :key="i">
        <v-skeleton-loader type="image" />
      </carousel-item>
    </carousel>
  </div>
</template>

<script>
import Carousel from '@components/layout/Carousel';
import CarouselItem from '@components/layout/CarouselItem';
export default {
  name: 'discoverSkeleton',
  components: {
    CarouselItem,
    Carousel,
  },
};
</script>

<style scoped lang="scss">
.release {
  ::v-deep .v-skeleton-loader__image {
    height: 300px;
  }
}
</style>
