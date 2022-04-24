<template>
  <div class="d-flex flex-column align-center artists-container">
    <v-avatar width="100%" height="100%" :size="$attrs.size" @click="go">
      <v-img :src="artist.picUrl" class="artist-image" aspect-ratio="1" lazy-src="@assets/default-cover.svg" />
    </v-avatar>
    <router-link v-if="!noInfo" :to="to" class="title text--primary text-center text-decoration-none">
      <span class="h-1x mt-2 text-body-2">{{ artist.name }}</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
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
function go() {
  router.push(to.value)
}
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
