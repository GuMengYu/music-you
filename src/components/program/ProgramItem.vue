<script setup lang="ts">
import {
  mdiDotsHorizontal,
  mdiHeart,
  mdiHeartOutline,
  mdiPause,
  mdiPlay,
  mdiPlayCircleOutline,
  mdiThumbUp,
} from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { VListItem } from 'vuetify/components'

import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { useUserStore } from '@/store/user'
import type { Album, Artist, Program, Track } from '@/types'
import { formatDate, formatDuring, formatNumber, sizeOfImage } from '@/util/fn'

const toast = useToast()
const { t } = useI18n()
const userStore = useUserStore()
const playerStore = usePlayerStore()
const player = usePlayer()

const { logged, account } = storeToRefs(userStore)
const props = defineProps({
  program: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: [String, Number],
    default: 0,
  },
})

const itemRef = ref<InstanceType<typeof VListItem>>()

const current = computed(() => {
  return props.program.id === playerStore.track?.id
})
const programAlbum = computed<Album>(() => props.program.mainSong.album ?? {})
const programCover = computed(() => sizeOfImage(props.program.coverUrl, 128))
const programDuration = computed(() => formatDuring(props.program.mainSong?.bMusic.playTime ?? 0))
const isVip = computed(() => account.value?.profile.vipType === 11)
const available = computed(() => {
  if (props.program.fee === 1) {
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
  } else if (props.program.fee === 4) {
    return {
      text: '付费专辑，先购买',
      enable: false,
    }
  } else if (props.program.noCopyrightRcmd) {
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
      program: Program
    }
  ): void
  (event: 'play', id: number): void
}>()
function play() {
  emit('play', props.program?.id)
}
function togglePlay() {
  if (current.value) {
    player.togglePlay()
  } else {
    play()
  }
}
function openMenu(e: MouseEvent) {
  // active current item
  // display context menu
  emit('openctxmenu', {
    x: e.x,
    y: e.y,
    program: props.program as Program,
  })
  itemRef!.value!.$el.click()
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
      @click="() => {}"
      @dblclick="play"
      @contextmenu.prevent="openMenu"
    >
      <div
        class="px-1 rounded-md track-item"
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
            :src="programCover"
            max-height="42"
            max-width="42"
            class="rounded"
            :lazy-src="placeholderUrl"
            :aspect-ratio="1"
          />
          <div class="track-info">
            <v-list-item-title
              class="line-clamp-1 text-subtitle-2 font-weight-regular"
              :class="current ? 'text-primary' : ''"
            >
              {{ program.name }}</v-list-item-title
            >
          </div>
        </div>
        <div class="track-second text-caption gap-6">
          <div class="d-flex align-center">
            <v-icon size="small" class="mr-1"> {{ mdiPlayCircleOutline }} </v-icon
            >{{ formatNumber(program.listenerCount) }}
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-small" class="mr-1"> {{ mdiThumbUp }} </v-icon>
            {{ formatNumber(program.likedCount) }}
          </div>
          <div>
            {{ formatDate(program.createTime, 'YYYY-MM-DD') }}
          </div>
          <div>
            {{ formatDuring(program.duration) }}
          </div>
          <!--          <v-btn v-visible="isHovering" class="ml-auto" icon color="primary" variant="text" @click.prevent="openMenu">-->
          <!--            <v-icon size="x-small">-->
          <!--              {{ mdiDotsHorizontal }}-->
          <!--            </v-icon>-->
          <!--          </v-btn>-->
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
  grid-template-columns: [index] 48px [first] 4fr [last] auto;
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
    display: grid;
    grid-template-columns: [listenCount] 80px [likeCount] 80px [createTime] 80px [duration] 58px;
    align-items: center;
    justify-items: start;
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
