<script setup lang="ts">
import { mdiPause, mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { VListItem } from 'vuetify/components'

import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { useUserStore } from '@/store/user'
import type { Album, Artist } from '@/types'
import { sizeOfImage } from '@/util/fn'

const toast = useToast()
const { t } = useI18n()
const userStore = useUserStore()
const playerStore = usePlayerStore()
const player = usePlayer()

const { logged, account } = storeToRefs(userStore)
const props = defineProps({
  track: {
    type: Object,
    default: () => ({}),
  },
  album: {
    type: Boolean,
    default: false,
  },
  cover: {
    type: Boolean,
    default: false,
  },
  index: {
    type: [String, Number],
    default: 0,
  },
  own: {
    type: Boolean,
    default: false,
  },
  fillPercent: {
    type: Number,
    default: 0,
  },
  fillNum: {
    type: Number,
    default: 0,
  },
})

const current = computed(() => {
  return props.track.id === playerStore.track?.id
})
const artists = computed(() => {
  const { ar, artists } = props.track
  const art = ar ?? artists ?? []
  return art.map((i: Artist) => ({ id: i.id, name: i.name }))
})
const trackAlbum = computed<Album>(() => props.track.al ?? props.track.album ?? {})
const albumCover = computed(() => sizeOfImage(trackAlbum.value.picUrl ?? trackAlbum.value.coverImgUrl, 128))
const isVip = computed(() => account.value?.profile.vipType === 11)
const available = computed(() => {
  if (props.track.fee === 1) {
    if (logged.value && isVip.value) {
      return {
        enable: true,
      }
    } else {
      return {
        enable: false,
        text: 'VIP用户可用',
      }
    }
  } else if (props.track.fee === 4) {
    return {
      text: '付费专辑，先购买',
      enable: false,
    }
  } else if (props.track.noCopyrightRcmd) {
    return {
      text: '无版权',
      enable: false,
    }
  } else {
    return {
      enable: true,
    }
  }
})
const emit = defineEmits<{
  (event: 'play', id: number): void
}>()
function play() {
  emit('play', props.track?.id)
}
function togglePlay() {
  if (current.value) {
    player.togglePlay()
  } else {
    play()
  }
}
</script>
<template>
  <v-hover v-slot="{ isHovering, props: _props }">
    <v-list-item v-bind="_props" rounded="md" class="pa-0" color="primary" @click="() => {}" @dblclick="play">
      <div
        class="rounded-md track-item"
        :title="available.enable ? '' : available.text"
        :class="{ unavailable: !available.enable }"
      >
        <div class="track-index d-flex justify-center">
          <span
            v-show="(!current || !playerStore.playing) && !isHovering"
            :class="{
              'track-count': true,
              'text-primary font-weight-bold': current,
            }"
            >{{ index }}</span
          >
          <v-btn v-show="isHovering" icon variant="text" color="primary" @click.stop="togglePlay">
            <v-icon>{{ current && playerStore.playing ? mdiPause : mdiPlay }}</v-icon>
          </v-btn>
          <Wave v-if="current && playerStore.playing && !isHovering" :playing="playerStore.playing" />
        </div>
        <div class="track-first">
          <v-img
            v-if="cover"
            :src="albumCover"
            max-height="40"
            max-width="40"
            class="rounded"
            :lazy-src="placeholderUrl"
            :aspect-ratio="1"
          />
          <div class="track-info">
            <v-list-item-title class="line-clamp-1" :class="current ? 'text-primary' : ''">
              {{ track.name }}</v-list-item-title
            >
            <v-list-item-subtitle class="d-flex align-center">
              <artists-link :artists="artists" class="line-clamp-1 text-caption" /> -
              <router-link
                v-if="trackAlbum.id"
                :to="`/album/${trackAlbum.id}`"
                class="text-caption text-onSurface line-clamp-1"
              >
                {{ trackAlbum.name }}
              </router-link>
            </v-list-item-subtitle>
          </div>
        </div>
        <div class="track-second"></div>
        <div class="track-third h-100 rounded-md">
          <div
            class="bg-surfaceVariant h-100 d-flex align-center px-2"
            :style="{
              width: `${fillPercent}%`,
            }"
          >
            <span class="text-secondary font-weight-medium">{{ fillNum }}次</span>
          </div>
        </div>
      </div>
    </v-list-item>
  </v-hover>
</template>

<style scoped lang="scss">
.track-item {
  flex: 1;
  display: grid;
  grid-gap: 5px;
  align-items: center;
  height: 56px;
  grid-template-columns: [index] 48px [first] 4fr [second] 1fr [last] 4fr;
  .track-index {
    .track-count {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .track-first {
    display: flex;
    align-items: center;
    gap: 16px;
    .track-info {
      :deep(.v-list-item-title) {
        white-space: initial;
      }
    }
    .track-quality {
      border-radius: 4px;
      border: 1px solid rgba(var(--v-theme-primary));
      color: rgba(var(--v-theme-primary));
      padding: 0 3px;
      font-size: 0.625rem;
      margin-right: 5px;
    }
  }
  .track-second {
    display: flex;
    align-items: center;
    justify-content: end;
  }
  .track-third {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.unavailable {
  cursor: initial;
  .track-cover {
    filter: opacity(0.6) grayscale(1);
  }
  .track-index,
  .track-info,
  .track-second,
  .track-third {
    opacity: 0.6;
  }
}
</style>
