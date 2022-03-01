<template>
  <span class="text-subtitle-2 artist-link">
    <router-link
      v-for="(artist, idx) in artists"
      :key="artist.id"
      :to="`/artist/${artist.id}`"
      class="onSurfaceVariant--text"
    >
      {{ artist.name || 'Nameless' }}
      {{ idx !== artists.length - 1 ? ', ' : '' }}
    </router-link>
  </span>
</template>

<script>
export default {
  name: 'ArtistsLink',
  props: {
    artists: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
<style lang="scss" scoped>
.artist-link {
  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
