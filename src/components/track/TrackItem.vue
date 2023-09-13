<script setup lang="ts">
import { mdiDotsHorizontal, mdiHeart, mdiHeartOutline, mdiPause, mdiPlay } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { VListItem } from 'vuetify/components'

import equaliser from '@/assets/equaliser-animated-green.gif'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { useUserStore } from '@/store/user'
import type { Album, Artist, Track } from '@/types'
import { formatDuring, sizeOfImage } from '@/util/fn'

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
})

const itemRef = ref<InstanceType<typeof VListItem>>()
const likeLoading = ref(false)

const liked = computed(() => {
  return !!userStore.likes.find((id: number) => id === props.track.id)
})
const current = computed(() => {
  return props.track.id === playerStore.track?.id
})
const artists = computed(() => {
  const { ar, artists } = props.track
  const art = ar ?? artists ?? []
  return art.map((i: Artist) => ({ id: i.id, name: i.name }))
})
const trackAlbum = computed<Album>(() => {
  return props.track.al ?? props.track.album ?? props.track.program.radio ?? {}
})
const albumCover = computed(() => sizeOfImage(trackAlbum.value.picUrl ?? trackAlbum.value.coverImgUrl, 128))
const className = computed(() => {
  return props.album ? 'track-item album-item' : 'track-item'
})
interface TrackSymbol {
  q?: 'Hi-Res' | 'SQ'
  vip?: boolean
}
const symbol = computed(() => {
  let _symbol: TrackSymbol = {}
  if (props.track.hr) {
    _symbol.q = 'Hi-Res'
  } else if (props.track.sq) {
    _symbol.q = 'SQ'
  }
  if (props.track.fee === 1) {
    _symbol.vip = true
  }
  return _symbol
})
const isVip = computed(() => account.value?.profile.vipType === 11)
const isProgram = computed(() => props.track.source?.fromType === 'program')
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
function togglePlay() {
  if (current.value) {
    player.togglePlay()
  } else {
    play()
  }
}
function openMenu(e: MouseEvent) {
  if (isProgram.value) {
    return
  }
  // active current item
  // display context menu
  emit('openctxmenu', {
    x: e.x,
    y: e.y,
    track: props.track as Track,
    liked: liked.value,
  })
  itemRef!.value!.$el.click()
}
async function toggleLike() {
  likeLoading.value = true
  const before = liked.value

  const success = await userStore.favSong(props.track.id, !liked.value)
  if (success) {
    if (before) {
      toast.success(t('message.remove_fav_success'))
    } else {
      toast.success(t('message.add_fav_success'))
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
      v-ripple="false"
      rounded="md"
      class="pa-0"
      color="primary"
      :value="track.id"
      @click="() => {}"
      @dblclick="play"
      @contextmenu.prevent="openMenu"
    >
      <div
        class="px-1 rounded-md"
        :title="available.enable ? '' : available.text"
        :class="{ [className]: true, unavailable: !available.enable }"
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
              <!-- <span v-if="symbol.vip" class="track-quality"> vip </span>
              <span v-if="symbol.q" class="track-quality"> {{ symbol.q }} </span> -->
              <artists-link :artists="artists" class="line-clamp-1 text-caption" />
            </v-list-item-subtitle>
          </div>
        </div>
        <div v-if="album" class="track-second">
          <router-link
            v-if="isProgram && track.source?.fromUrl"
            :to="track.source?.fromUrl!"
            class="text-subtitle-2 text-onSurface line-clamp-2"
          >
            {{ trackAlbum.name }}
          </router-link>
          <router-link
            v-else-if="trackAlbum.id"
            :to="`/album/${trackAlbum.id}`"
            class="text-subtitle-2 text-onSurface line-clamp-2"
          >
            {{ trackAlbum.name }}
          </router-link>
          <span v-else>{{ '未知' }}</span>
        </div>
        <div class="track-third">
          <v-btn
            v-if="!isProgram"
            v-visible="liked || isHovering"
            :loading="likeLoading"
            icon
            variant="text"
            :color="liked ? 'primary' : ''"
            @click.prevent="toggleLike"
          >
            <v-icon size="x-small" :color="liked ? 'primary' : ''">{{ liked ? mdiHeart : mdiHeartOutline }}</v-icon>
          </v-btn>
          <div class="track-duration">
            {{ formatDuring(track.dt || track.duration || 0) }}
          </div>
          <v-btn v-if="!isProgram" v-visible="isHovering" icon color="primary" variant="text" @click.prevent="openMenu">
            <v-icon size="x-small">
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
  grid-gap: 5px;
  align-items: center;
  height: 56px;
  grid-template-columns: [index] 48px [first] 4fr [last] minmax(140px, 160px);
  &.album-item {
    grid-template-columns: [index] 48px [first] 3fr [second] 2fr [last] minmax(140px, 160px);
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
    width: fit-content;
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
