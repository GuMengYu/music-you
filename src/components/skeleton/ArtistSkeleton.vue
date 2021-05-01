<template>
  <div>
    <div class="artist d-flex flex-column align-center justify-end">
      <v-skeleton-loader type="avatar" class="avatar" />
      <div class="actions d-flex justify-space-between mt-10">
        <v-skeleton-loader type="avatar" />
        <v-skeleton-loader type="button" />
      </div>
    </div>
    <div class="my-4">
      <v-skeleton-loader type="heading" width="300" />
      <carousel :rows="4" grid-style="C">
        <v-skeleton-loader
          type="list-item-avatar-two-line"
          v-for="i in 12"
          :key="i"
        />
      </carousel>
      x
    </div>
  </div>
</template>
<script>
import Carousel from '@components/layout/Carousel.vue';
export default {
  name: 'ArtistSkeleton',
  components: {
    Carousel,
  },
};
</script>
<style lang="scss" scoped>
.artist {
  height: 342px;
  @media screen and (min-width: 1000px) {
    height: 386px;
  }
  .avatar {
    ::v-deep {
      display: flex;
      justify-content: center;
      .v-skeleton-loader__avatar {
        height: 190px;
        width: 190px;
      }
    }
  }
  .actions {
    width: 100%;
  }
}
</style>
