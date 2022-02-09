<template>
  <div>
    <v-btn @click="show"> show toast </v-btn>
    <store-card :presence="presence" />
  </div>
</template>

<script>
import StoreCard from '@components/app/StoreCard';
import { generatePaletteFromURL } from 'theme-generator';
export default {
  name: 'Index',
  components: { StoreCard },
  data: () => ({
    data: {},
    presence: {
      title: 'YouTuBe',
      cover: 'https://i.imgur.com/OAcBmwW.png',
      color: 'rgb(225, 48, 108)',
      description: '简介 你猜是什么的哦屋顶萨瓦河 ',
      artist: {
        id: '234',
        name: 'justin',
      },
    },
  }),
  async created() {
    const result = await generatePaletteFromURL(
      'https://i.imgur.com/OAcBmwW.png',
    );
    this.presence.color = result.primaryGroup?.luminance40;
  },
  methods: {
    show() {
      this.$toast('Default toast', { timeout: -1 });
    },
  },
};
</script>

<style scoped></style>
