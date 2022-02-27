<template>
  <span class="text-subtitle-2">
    <router-link
      v-for="(artist, idx) in artists"
      :key="artist.id"
      :to="`/artist/${artist.id}`"
      class="text-decoration-none onSurfaceVariant--text"
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
