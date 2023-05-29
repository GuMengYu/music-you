<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { VListItem } from 'vuetify/components'

import placeholderUrl from '@/assets/placeholder.png'
import { usePlayerStore } from '@/store/player'
import { useUserStore } from '@/store/user'
import type { Album, Artist, Track } from '@/types'
import { sizeOfImage } from '@/util/fn'

const toast = useToast()
const { t } = useI18n()
const userStore = useUserStore()
const playerStore = usePlayerStore()

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
</script>
<template>
  <v-list-item
    ref="itemRef"
    rounded="md"
    class="pa-0"
    color="primary"
    :value="track.id"
    @click="() => {}"
    @dblclick="play"
    @contextmenu.prevent="openMenu"
  >
    <div
      class="rounded-md track-item"
      :title="available.enable ? '' : available.text"
      :class="{ unavailable: !available.enable }"
    >
      <div class="track-index">
        <v-img
          :src="albumCover"
          max-height="56"
          max-width="56"
          class="rounded-md ml-1"
          :lazy-src="placeholderUrl"
          :aspect-ratio="1"
        />
      </div>
      <div class="track-first">
        <div class="track-info text-medium-emphasis select-text">
          <v-list-item-title class="line-clamp-1" :class="current ? 'text-primary' : ''">
            {{ track.name }}
          </v-list-item-title>
          <v-list-item-subtitle class="d-flex align-center">
            <artists-link :artists="artists" class="line-clamp-1 text-body-2" />
          </v-list-item-subtitle>
        </div>
      </div>
      <div class="track-third text-medium-emphasis select-text">
        <Wave v-if="current" :playing="playerStore.playing" />
        <span
          v-else
          class="font-weight-medium track-count"
          :class="{
            'text-primary': current,
          }"
          >{{ `${index}`.padStart(2, '0') }}</span
        >
      </div>
    </div>
  </v-list-item>
</template>

<style scoped lang="scss">
.track-item {
  flex: 1;
  display: grid;
  grid-gap: 8px;
  align-items: center;
  height: 64px;
  grid-template-columns: [index] 64px [first] 4fr [last] 40px;
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
    align-items: center;
    justify-content: center;
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
