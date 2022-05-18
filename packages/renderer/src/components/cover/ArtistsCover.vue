<template>
  <div class="d-flex flex-column align-center artists-container">
    <v-img
      cover
      width="100%"
      :src="coverUrl"
      class="artist-image rounded-circle"
      aspect-ratio="1"
      :lazy-src="placeHolderUrl"
      :min-width="$attrs['min-width']"
      :max-width="$attrs['max-width']"
      :max-height="$attrs['max-height']"
      :min-height="$attrs['min-height']"
      @click="go"
    />
    <artists-link v-if="!noInfo" :artists="[artist]" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import placeHolderUrl from '@/assets/placeholder.png'
import { sizeOfImage } from '@/util/fn'
const router = useRouter()
const props = defineProps({
  artist: {
    type: Object,
    default: () => ({}),
  },
  noInfo: {
    type: Boolean,
    default: false,
  },
})

const to = computed(() => {
  return `/artist/${props.artist?.id}`
})
const coverUrl = computed(() => {
  return sizeOfImage(props.artist.picUrl ?? props.artist.cover, 256)
})
function go() {
  router.push(to.value)
}
</script>

<style scoped lang="scss">
.artists-container {
  .artist-image {
    transition: transform 0.3s;
    &:hover {
      transform: scale(1.05);
      cursor: pointer;
    }
  }
}
</style>
