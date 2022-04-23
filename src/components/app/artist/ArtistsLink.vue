<template>
  <span class="artist-link">
    <router-link
      v-for="(artist, idx) in props.artists"
      :key="artist.id"
      :to="`/artist/${artist.id}`"
      class="text-onSurfaceVariant"
    >
      {{ artist.name || 'Nameless' }}
      {{ idx !== props.artists.length - 1 ? ', ' : '' }}
    </router-link>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  artists: {
    type: Array,
    default: () => [],
  },
})
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
