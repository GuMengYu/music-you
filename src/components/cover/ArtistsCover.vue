<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      class="d-flex flex-column align-center artists-container pa-4"
      color="surfaceVariant"
      flat
      rounded="md"
      :class="{ 'on-hover': isHovering }"
      :elevation="isHovering ? 1 : 0"
      v-bind="{ ...hoverProps, ...$attrs }"
    >
      <v-img
        cover
        width="100%"
        :src="coverUrl"
        class="artist-image rounded-circle"
        :aspect-ratio="1"
        style="aspect-ratio: 1"
        :lazy-src="placeHolderUrl"
        @click="go"
      />
      <artists-link v-if="!noInfo" :artists="[artist]" class="mt-4 line-clamp-1" />
    </v-card>
  </v-hover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import placeHolderUrl from '@/assets/placeholder.png'
import { sizeOfImage, toHttps } from '@/util/fn'
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
  return sizeOfImage(toHttps(props.artist.picUrl ?? props.artist.cover), 512)
})
function go() {
  router.push(to.value)
}
</script>

<style scoped lang="scss">
.artists-container {
  .artist-image {
    &:hover :deep(.v-img__img) {
      transform: scale(1.075);
      cursor: pointer;
    }
    :deep(.v-img__img) {
      transition: transform 0.3s;
    }
  }
}
</style>
