<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      class="cover-container text-decoration-none"
      rounded="md"
      :flat="true"
      color="surfaceVariant"
      :class="{ 'on-hover': isHovering }"
      :elevation="isHovering ? 1 : 0"
      v-bind="{ ...hoverProps, ...$attrs }"
      :to="to"
    >
      <v-img
        class="rounded-md"
        :cover="true"
        :src="coverBgUrl"
        :aspect-ratio="1"
        style="aspect-ratio: 1"
        :lazy-src="placeholderUrl"
      >
      </v-img>
      <div v-if="shadow" class="cover-shadow" :style="`background-image: url('${coverBgUrl}')`" />
      <v-card-title :class="`line-clamp-${titleLine}`" style="white-space: initial">
        <router-link :to="to" class="text-subtitle-2 text-onSurfaceVariant">
          {{ data.name }}
        </router-link>
      </v-card-title>
      <span v-if="subTitle" class="line-clamp-1 text-subtitle-2 text-disabled mb-4 px-4">
        {{ subTitle }}
      </span>
      <slot />
    </v-card>
  </v-hover>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'

import placeholderUrl from '@/assets/placeholder.png'
import useInForeground from '@/hooks/useInForeground'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { sizeOfImage, toHttps } from '@/util/fn'
const player = usePlayer()
const playStore = usePlayerStore()
const playQueue = usePlayQueueStore()
const loading = ref<boolean>(false)
const { playing } = storeToRefs(playStore)
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  titleLine: {
    type: Number,
    default: 1,
  },
  subTitle: {
    type: String,
    default: '',
  },
  extra: {
    type: String,
    default: null,
  },
  shadow: {
    type: Boolean,
    default: false,
  },
})
const { isActive: isInDetail } = useInForeground(['podcast'])

const coverBgUrl = computed(() => {
  return sizeOfImage(toHttps(props.data.picUrl ?? props.data.coverImgUrl))
})
const subTitle = computed(() => {
  return props.extra ?? props.data.rcmdtext
})

const to = computed(() => `/podcast/${props.data.id}`)
</script>
<style scoped lang="scss">
.cover-container {
  overflow: visible;
  .cover-shadow {
    position: absolute;
    z-index: 0;
    height: 100%;
    width: 100%;
    top: 10%;
    border-radius: 20px;
    filter: blur(30px);
    transform: scale(0.9);
    background-size: cover;
  }
}
</style>
