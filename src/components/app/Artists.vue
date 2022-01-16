<template>
  <div class="d-flex flex-column align-center artists-container">
    <v-avatar width="100%" height="100%" @click="go" :size="$attrs.size">
      <v-img
        :src="artists.picUrl || artists.cover | sizeOfImage"
        class="artist-image"
        aspect-ratio="1"
        lazy-src="@/assets/default-cover.png"
      />
    </v-avatar>
    <router-link
      v-if="!noInfo"
      :to="to"
      class="title text--primary text-center text-decoration-none"
    >
      <span class="h-1x mt-2 text-body-2">{{ artists.name }}</span>
    </router-link>
  </div>
</template>

<script>
import { mdiPlay } from '@mdi/js';
export default {
  name: 'ArtistsCover',
  props: {
    artists: {
      type: Object,
      default: () => ({}),
    },
    noInfo: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mdiPlay,
  }),
  computed: {
    to() {
      return `/artist/${this.artists.id}`;
    },
  },
  methods: {
    go() {
      this.$router.push(this.to);
    },
  },
};
</script>

<style scoped lang="scss">
.artists-container {
  .artist-image {
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.1);
      cursor: pointer;
    }
  }
}
</style>
