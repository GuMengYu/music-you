<template>
  <div>
    <carousel :items="5">
      <carousel-item v-for="i in 9" :key="i">
        <cover :data="data" />
      </carousel-item>
    </carousel>
    <v-btn @click="show"> show toast </v-btn>
  </div>
</template>

<script>
import Carousel from '@components/layout/Carousel';
import CarouselItem from '@components/layout/CarouselItem';
import Cover from '@components/app/Cover'
export default {
  name: 'Index',
  components: { Cover, CarouselItem, Carousel },
  data: () => ({
    data: {
      tracks: [],
      songs: [],
      coverImgUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Features124/v4/7b/1d/f0/7b1df048-0017-8ac0-98c9-735f14849606/mza_7507996640781423701.png/600x600bb.webp',
      name: '',
      description: '',
    },
  }),
  methods: {
    show() {
      this.$message({
        message: 'haodea',
      });
    },
  },
};
</script>

<style scoped></style>
