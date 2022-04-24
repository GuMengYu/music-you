<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      class="cover-container"
      :rounded="rounded"
      flat
      color="surfaceVariant"
      :class="{ 'on-hover': isHovering }"
      :elevation="isHovering ? 1 : 0"
      v-bind="props"
      :min-width="$attrs['min-width']"
      :max-width="$attrs['max-width']"
      :max-height="$attrs['max-height']"
      :min-height="$attrs['min-height']"
      :to="to"
    >
      <v-img
        class="cover-image"
        :class="`rounded-${rounded}`"
        cover
        :src="coverBgUrl"
        :aspect-ratio="1"
        :lazy-src="placeholderUrl"
      >
        <div class="d-flex flex-fill fill-height align-end pa-2">
          <transition name="slide-fade-y">
            <v-btn v-if="isHovering" icon color="primary" @click.prevent="play">
              <v-icon color="onPrimary">{{ mdiPlay }} </v-icon>
            </v-btn>
          </transition>
        </div>
      </v-img>
      <v-card-title v-if="!noInfo" :class="`h-${titleLine}x`" class="text-subtitle-1 text-onSurfaceVariant">
        <router-link :to="`/playlist/${data.id}`" class="text-onSurfaceVariant text-decoration-none">
          {{ data.name }}
        </router-link>
      </v-card-title>
      <v-card-subtitle v-if="!noInfo && subTitle" class="text-subtitle-2 pb-4">
        <span v-if="subTitle" class="h-1x">
          {{ subTitle }}
        </span>
      </v-card-subtitle>
      <slot />
    </v-card>
  </v-hover>
</template>
<script setup lang="ts">
import { mdiPlay } from '@mdi/js'
import { computed, ref } from 'vue'

import { getList } from '@/api/music'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { sizeOfImage } from '@/util/fn'
const player = usePlayer()
const loading = ref<boolean>(false)
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  rounded: {
    type: [String, Boolean],
    default: 'lg',
  },
  type: {
    type: String,
    default: 'album',
    require: true,
  },
  titleLine: {
    type: Number,
    default: 1,
  },
  subTitle: {
    type: String,
    default: '',
  },
  noInfo: {
    type: Boolean,
    default: false,
  },
  extra: {
    type: String,
    default: null,
  },
})

const coverBgUrl = computed(() => {
  return sizeOfImage(props.data.picUrl ?? props.data.coverImgUrl, 1024)
})
const subTitle = computed(() => {
  return props.extra ?? props.data.copywriter
})

const to = computed(() => {
  return {
    album: `/album/${props.data.id}`,
    playlist: `/playlist/${props.data.id}`,
    artist: `/artist/${props.data.id}`,
  }[props.type]
})

async function play() {
  loading.value = true
  try {
    const info = await getList(props.type, props.data.id)
    const tracks = {
      list:
        props.type === 'album'
          ? info.songs
          : props.type === 'playlist'
          ? info
          : props.type === 'artist'
          ? info.tracks
          : [],
      id: info.id,
    }
    await player.updateTracks(tracks, true)
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}
</script>
<style scoped lang="scss">
.cover-container {
  .cover-image {
    border-bottom-left-radius: initial !important;
    border-bottom-right-radius: initial !important;
  }
}
</style>
