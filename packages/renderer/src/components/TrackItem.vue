<script setup lang="ts">
import { mdiDotsHorizontal, mdiHeart, mdiHeartOutline, mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import placeholderUrl from '@/assets/placeholder.png'
import { useToastStore } from '@/store/toast'
import { useUserStore } from '@/store/user'
import type { Artist } from '@/types'
import { formatDuring, sizeOfImage } from '@/util/fn'

const toast = useToastStore()
const userStore = useUserStore()

const { logged, account } = storeToRefs(userStore)
const props = defineProps({
  track: {
    type: Object,
    default: () => ({}),
  },
  from: {
    type: String,
    default: 'album',
  },
  index: {
    type: [String, Number],
    default: 0,
  },
  own: {
    type: Boolean,
    default: false,
  },
})

const likeLoading = ref(false)

const liked = computed(() => {
  return userStore.likes.find((id) => id === props.track.id)
})
const artists = computed(() => {
  const { ar, artists } = props.track
  const art = ar ?? artists ?? []
  return art.map((i: Artist) => ({ id: i.id, name: i.name }))
})
const album = computed(() => props.track.al ?? props.track.album ?? {})
const albumCover = computed(() => sizeOfImage(album.value.picUrl ?? album.value.coverImgUrl, 128))
const gridTemplate = computed(() => {
  if (props.from !== 'album') {
    return {
      gridTemplateColumns: '[index] 40px [first] 3fr [second] 2fr [last] minmax(100px, 1fr)',
    }
  } else {
    return {
      gridTemplateColumns: '[index] 40px [first] 4fr [last] minmax(100px, 1fr)',
    }
  }
})
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
const emit = defineEmits(['play'])
function play() {
  emit('play', props.track?.id)
}
async function toggleLike() {
  likeLoading.value = true
  const before = liked.value

  const success = await userStore.favSong(props.track.id, !liked.value)
  if (success) {
    if (before) {
      toast.show('已从"喜欢的音乐"移除')
    } else {
      toast.show('已添加至"喜欢的音乐"')
    }
  } else {
    toast.show('操作频繁或者网络出现错误')
  }
  likeLoading.value = false
}
</script>
<template>
  <v-hover v-slot="{ isHovering, props: _props }">
    <div
      v-ripple
      v-bind="_props"
      class="track-item-wrapper rounded-lg px-2"
      :class="{ unavailable: !available.enable }"
      :style="gridTemplate"
      :title="available.enable ? '' : available.text"
      @dblclick="play"
    >
      <div class="track-index">
        <span v-show="!isHovering" class="track-count">{{ index }}</span>
        <v-btn v-show="isHovering" icon variant="contained-text" size="small" color="primary" @click.stop="play">
          <v-icon size="small">{{ mdiPlay }}</v-icon>
        </v-btn>
      </div>
      <div class="track-first">
        <v-img
          v-if="from !== 'album'"
          :src="albumCover"
          max-height="40"
          max-width="40"
          class="rounded"
          :lazy-src="placeholderUrl"
          :aspect-ratio="1"
        />
        <div class="track-info">
          <v-list-item-title class="h-1x" v-text="track.name" />
          <v-list-item-subtitle>
            <artists-link :artists="artists" class="h-1x" />
          </v-list-item-subtitle>
        </div>
      </div>
      <div v-if="from !== 'album'" class="track-second">
        <router-link :to="`/album/${album.id}`" class="text-subtitle-2 text-onSurface h-2x">
          {{ album.name }}
        </router-link>
      </div>
      <div class="track-third">
        <v-btn v-visible="liked || isHovering" size="small" icon variant="text" @click.prevent="toggleLike">
          <v-icon size="small" :color="liked ? 'primary' : ''">{{ liked ? mdiHeart : mdiHeartOutline }}</v-icon>
        </v-btn>
        <!--        <like-toggle :id="track.id" />-->
        <div class="track-duration">
          {{ formatDuring(track.dt || track.duration || 0) }}
        </div>
        <v-btn v-visible="isHovering" icon color="primary" variant="contained-text" size="small">
          <v-icon size="small">
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-hover>
</template>

<style scoped lang="scss">
.track-item-wrapper {
  display: grid;
  grid-gap: 16px;
  align-items: center;
  height: 56px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(var(--v-theme-surfaceVariant), 0.5);
  }
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
  }
  .track-second {
    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .track-third {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: end;
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
