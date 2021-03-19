<template>
  <div class="d-flex flex-column align-center artists-container">
    <v-hover v-slot="{ hover }">
      <v-avatar
        :class="{ 'artist-hover': hover }"
        width="100%"
        height="100%"
        @click="go"
      >
        <v-img
          :src="artists.img1v1Url | sizeOfImage"
          class="artist-image"
          aspect-ratio="1"
        />
      </v-avatar>
    </v-hover>
    <router-link
      :to="to"
      class="title text--primary text-center text-decoration-none"
    >
      <span class="h-1x mt-2 text-body-2 font-weight-bold">{{
        artists.name
      }}</span>
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
  .artist-hover {
    transition: 0.5s all ease;
    transform: scale(1.025);
    cursor: pointer;
  }
}
</style>
