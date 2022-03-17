<template>
  <div class="discover-skeleton">
    <div>
      <v-skeleton-loader type="heading" class="my-4" />
      <carousel grid-style="A">
        <carousel-item v-for="i in 4" :key="i">
          <v-skeleton-loader type="image" class="release" />
        </carousel-item>
      </carousel>
    </div>
    <div>
      <v-skeleton-loader type="heading" class="my-4" />
      <carousel>
        <carousel-item v-for="i in 6" :key="i">
          <v-skeleton-loader type="image" />
        </carousel-item>
      </carousel>
    </div>
    <div>
      <v-skeleton-loader type="heading" class="my-4" />
      <carousel>
        <carousel-item v-for="i in 6" :key="i">
          <v-skeleton-loader type="image" />
        </carousel-item>
      </carousel>
    </div>
  </div>
</template>

<script>
import Carousel from '@components/layout/Carousel.vue';
import CarouselItem from '@components/layout/CarouselItem.vue';
export default {
  name: 'discoverSkeleton',
  components: {
    CarouselItem,
    Carousel,
  },
};
</script>

<style scoped lang="scss">
.discover-skeleton {
  display: flex;
  gap: 24px;
  flex-flow: column nowrap;
  .release {
    ::v-deep .v-skeleton-loader__image {
      height: 80px;
    }
  }
}
</style>
