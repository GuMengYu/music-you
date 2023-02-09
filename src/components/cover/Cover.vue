<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      class="cover-container text-decoration-none"
      :rounded="rounded"
      :flat="true"
      color="surfaceVariant"
      :class="{ 'on-hover': isHovering }"
      :elevation="isHovering ? 1 : 0"
      v-bind="{ ...hoverProps, ...$attrs }"
      :to="to"
    >
      <v-img
        :class="`rounded-${rounded} ${noInfo ? 'cover-image' : 'cover-image-with-info'}`"
        :cover="true"
        :src="coverBgUrl"
        :aspect-ratio="1"
        :lazy-src="placeholderUrl"
      >
        <div class="d-flex flex-fill fill-height align-end pa-2">
          <transition name="slide-fade-y">
            <div v-if="(isHovering || inActive) && showHover" class="d-flex flex-fill justify-space-between">
              <v-btn :icon="true" color="primary" :loading="loading" @click.prevent="toggle">
                <v-icon color="onPrimary">{{ coverPlaying ? mdiPause : mdiPlay }} </v-icon>
              </v-btn>
              <slot name="action" />
            </div>
          </transition>
        </div>
      </v-img>
      <v-card-title v-if="!noInfo" :class="`line-clamp-${titleLine}`" style="white-space: initial">
        <router-link :to="`/playlist/${data.id}`" class="text-subtitle-2 text-onSurfaceVariant">
          {{ data.name }}
        </router-link>
      </v-card-title>
      <v-card-subtitle v-if="!noInfo && subTitle" class="text-subtitle-2 pb-4">
        <span v-if="subTitle" class="line-clamp-1">
          {{ subTitle }}
        </span>
      </v-card-subtitle>
      <slot />
    </v-card>
  </v-hover>
</template>
<script setup lang="ts">
import { mdiPause, mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { getTrackList } from '@/api/music'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { sizeOfImage, toHttps } from '@/util/fn'
const player = usePlayer()
const playStore = usePlayerStore()
const playQueue = usePlayQueueStore()
const loading = ref<boolean>(false)
const { playing } = storeToRefs(playStore)
const loaded = ref(false)
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
  showHover: {
    type: Boolean,
    default: true,
  },
  extra: {
    type: String,
    default: null,
  },
})

const coverBgUrl = computed(() => {
  return sizeOfImage(toHttps(props.data.picUrl ?? props.data.coverImgUrl))
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
const inActive = computed(() => {
  return props.data.id === playQueue.queue.id
})
const coverPlaying = computed(() => {
  return playing.value && inActive.value
})

async function toggle() {
  if (coverPlaying.value) {
    player.pause()
  } else {
    if (loaded.value && inActive.value) {
      player.play()
    } else {
      loading.value = true
      try {
        const info = await getTrackList(<'album' | 'playlist'>props.type, props.data.id)
        playQueue.updatePlayQueue(info.id, <'album' | 'playlist'>props.type, props.data.name, info.tracks)
        player.next()
        loaded.value = true
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.cover-container {
  .cover-image-with-info {
    border-bottom-left-radius: initial !important;
    border-bottom-right-radius: initial !important;
  }
}
</style>
