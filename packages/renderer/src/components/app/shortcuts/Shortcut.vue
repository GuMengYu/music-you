<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      rounded="lg"
      color="surfaceVariant"
      class="d-flex quick-card align-center"
      flat
      :height="80"
      :to="to"
      v-bind="props"
      :elevation="isHovering ? 1 : 0"
    >
      <div
        :class="`bg-${flag.color}`"
        class="rounded-circle d-flex align-center justify-center ml-4"
        style="height: 45px; width: 45px; min-width: 45px"
      >
        {{ flag.label }}
      </div>
      <div class="d-flex align-start justify-space-between flex-fill px-4 flex-column text-onSurfaceVariant">
        <span :title="data.name" class="text-subtitle-1 h-1x">
          {{ data.title }}
        </span>
        <span :title="data.name" class="text-subtitle-2 h-1x">
          {{ data.subTitle }}
        </span>
      </div>
      <v-img
        :min-width="80"
        :min-height="80"
        :max-height="80"
        :max-width="80"
        class="card-img"
        :lazy-src="placeholderUrl"
        :src="coverImgUrl"
      >
        <div class="action d-flex justify-center align-center fill-height flex-fill">
          <transition name="slide-fade-x">
            <v-btn v-show="isHovering" icon :color="flag.color" :loading="loading" @click.prevent="play">
              <v-icon color="onPrimary">{{ mdiPlay }}</v-icon>
            </v-btn>
          </transition>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { mdiPlay } from '@mdi/js'
import { computed, ref } from 'vue'

import { getDailyRecommend } from '@/api'
import { getTrackList } from '@/api/music'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import type { TrackSource } from '@/types'
import { sizeOfImage } from '@/util/fn'
const player = usePlayer()
const props = defineProps<{
  data: {
    id: number
    title: string
    subTitle: string
    picUrl: string
  }
  type: 'album' | 'playlist' | 'artist'
  flag: {
    color: string
    label: string
  }
}>()

const loading = ref<boolean>(false)

const coverImgUrl = computed(() => {
  if (props.data.picUrl) {
    return sizeOfImage(props.data.picUrl, 256)
  } else {
    return placeholderUrl
  }
})

const to = computed(() => {
  return {
    album: `/album/${props.data.id}`,
    playlist: `/playlist/${props.data.id}`,
    artist: `/artist/${props.data.id}`,
  }[props.type]
})
async function play() {
  try {
    loading.value = true
    let info: {
      id: number
      list: TrackSource[]
    }
    if (props.type === 'daily') {
      const { data = {} } = await getDailyRecommend()
      info = {
        id: data.id,
        list: data['dailySongs'],
      }
    } else {
      const data = await getTrackList(props.type, props.data.id)
      info = {
        id: data.id,
        list: data.tracks,
      }
    }
    await player.updateTracks(info)
  } catch (e) {
    console.debug(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.quick-card {
  cursor: pointer;
  .card-img {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit !important;
  }
}
</style>
