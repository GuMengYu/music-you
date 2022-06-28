<script setup lang="ts">
import { mdiDotsHorizontal, mdiHeart, mdiHeartOutline, mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import placeholderUrl from '@/assets/placeholder.png'
import { useUserStore } from '@/store/user'
import type { Album, Artist, Track } from '@/types'
import { formatDuring, sizeOfImage } from '@/util/fn'

const toast = useToast()
const { t } = useI18n()
const userStore = useUserStore()

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
})

const itemRef = ref<ComponentPublicInstance>()
const likeLoading = ref(false)

const liked = computed(() => {
  return !!userStore.likes.find((id: number) => id === props.track.id)
})
const artists = computed(() => {
  const { ar, artists } = props.track
  const art = ar ?? artists ?? []
  return art.map((i: Artist) => ({ id: i.id, name: i.name }))
})
const trackAlbum = computed<Album>(() => props.track.al ?? props.track.album ?? {})
const albumCover = computed(() => sizeOfImage(trackAlbum.value.picUrl ?? trackAlbum.value.coverImgUrl, 128))
const className = computed(() => {
  return props.album ? 'track-item album-item' : 'track-item'
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
const emit = defineEmits<{
  (
    event: 'openctxmenu',
    payload: {
      x: number
      y: number
      track: Track
      liked: boolean
    }
  ): void
  (event: 'play', id: number): void
}>()
function play() {
  emit('play', props.track?.id)
}
function openMenu(e: MouseEvent) {
  // active current item
  itemRef!.value!.$el.click()
  // display context menu
  emit('openctxmenu', {
    x: e.x,
    y: e.y,
    track: props.track as Track,
    liked: liked.value,
  })
}
async function toggleLike() {
  likeLoading.value = true
  const before = liked.value

  const success = await userStore.favSong(props.track.id, !liked.value)
  if (success) {
    if (before) {
      toast.success(t('message.add_fav_success'))
    } else {
      toast.success(t('message.remove_fav_success'))
    }
  } else {
    toast.error(t('message.something_wrong'))
  }
  likeLoading.value = false
}
</script>
<template>
  <v-hover v-slot="{ isHovering, props: _props }">
    <v-list-item
      v-bind="_props"
      ref="itemRef"
      rounded="lg"
      class="pa-0"
      active-color="primary"
      :value="track.id"
      @dblclick="play"
      @contextmenu.prevent="openMenu"
    >
      <div
        class="px-2 rounded-lg"
        :title="available.enable ? '' : available.text"
        :class="{ [className]: true, unavailable: !available.enable }"
      >
        <div class="track-index">
          <span v-show="!isHovering" class="track-count">{{ index }}</span>
          <v-btn v-show="isHovering" icon variant="text" size="small" color="primary" @click.stop="play">
            <v-icon size="small">{{ mdiPlay }}</v-icon>
          </v-btn>
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
            <v-list-item-title class="line-clamp-1" v-text="track.name" />
            <v-list-item-subtitle>
              <artists-link :artists="artists" class="line-clamp-1 text-caption" />
            </v-list-item-subtitle>
          </div>
        </div>
        <div v-if="album" class="track-second">
          <router-link :to="`/album/${trackAlbum.id}`" class="text-subtitle-2 text-onSurface line-clamp-2">
            {{ trackAlbum.name }}
          </router-link>
        </div>
        <div class="track-third">
          <v-btn v-visible="liked || isHovering" size="small" icon variant="text" @click.prevent="toggleLike">
            <v-icon size="small" :color="liked ? 'primary' : ''">{{ liked ? mdiHeart : mdiHeartOutline }}</v-icon>
          </v-btn>
          <div class="track-duration">
            {{ formatDuring(track.dt || track.duration || 0) }}
          </div>
          <v-btn v-visible="isHovering" icon color="primary" variant="text" size="small" @click.prevent="openMenu">
            <v-icon size="small">
              {{ mdiDotsHorizontal }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-list-item>
  </v-hover>
</template>

<style scoped lang="scss">
.track-item {
  flex: 1;
  display: grid;
  grid-gap: 16px;
  align-items: center;
  height: 56px;
  cursor: pointer;
  transition: background-color 0.25s ease;
  grid-template-columns: [index] 40px [first] 4fr [last] minmax(160px, 200px);
  &.album-item {
    grid-template-columns: [index] 40px [first] 3fr [second] 2fr [last] minmax(160px, 200px);
  }
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
    width: fit-content;
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
