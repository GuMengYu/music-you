<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      rounded="lg"
      color="surfaceVariant"
      class="d-flex quick-card align-center"
      flat
      :height="80"
      :to="to"
      v-bind="hoverProps"
      :elevation="isHovering ? 1 : 0"
    >
      <div
        :class="`bg-${flag.color}`"
        class="rounded-circle d-flex align-center justify-center ml-4"
        style="height: 45px; width: 45px; min-width: 45px"
      >
        <v-icon v-if="flag.icon" size="small">
          {{ flag.icon }}
        </v-icon>
        <span v-if="flag.label">
          {{ flag.label }}
        </span>
      </div>
      <div class="d-flex align-start justify-space-between flex-fill px-4 flex-column text-onSurfaceVariant">
        <span :title="data.title" class="text-subtitle-1 line-clamp-1">
          {{ data.title }}
        </span>
        <span :title="data.subTitle" class="text-subtitle-2 line-clamp-1">
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
        <div v-if="canPlay" class="action d-flex justify-center align-center fill-height flex-fill">
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

import { getTrackList } from '@/api/music'
import { getDailyRecommend } from '@/api/user'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'
import { sizeOfImage } from '@/util/fn'

const player = usePlayer()
const playQueueStore = usePlayQueueStore()
const props = defineProps<{
  data: {
    id?: number
    title: string
    subTitle?: string
    picUrl: string
  }
  type: 'album' | 'playlist' | 'artist' | 'daily'
  flag: {
    color: string
    label?: string
    icon?: string
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
    daily: `/daily`,
    wallhaven: '/wallhaven',
  }[props.type]
})

const canPlay = computed(() => {
  return ['daily', 'album', 'playlist', 'artist'].includes(props.type)
})
async function play() {
  try {
    loading.value = true
    let info: {
      id?: number
      list: Track[]
    }
    if (props.type === 'daily') {
      const { data } = await getDailyRecommend()
      info = {
        list: data['dailySongs'],
      }
      playQueueStore.updatePlayQueue(0, 'daily', '日推', info.list)
    } else {
      const data = await getTrackList(props.type, props.data.id as number)
      info = {
        id: data.id,
        list: data.tracks,
      }
      playQueueStore.updatePlayQueue(info.id!, props.type, data.name!, info.list)
    }
    player.next()
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
