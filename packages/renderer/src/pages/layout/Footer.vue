<template>
  <transition name="slide-fade-y">
    <v-app-bar v-if="track?.id" location="bottom" fixed class="player-footer px-2" :order="-1">
      <Slider
        class="track-slider"
        :model-value="currentTime"
        :min="0"
        :max="trackDt / 1000"
        :color="currentTheme.colors.primary"
        track-color="rgba(66,66,66,0.28)"
        :height="2"
        @drag-start="dragStart"
        @drag-end="dragEnd"
      ></Slider>
      <div class="playing-control">
        <div class="playing-bar__left">
          <v-hover v-slot="{ isHovering, props }">
            <v-img
              v-bind="props"
              class="rounded"
              :aspect-ratio="1"
              :min-width="48"
              :max-width="48"
              :max-height="48"
              :src="albumPicUrl"
              cover
            >
              <v-btn v-show="isHovering" icon @click.stop="showPlayingPage">
                <v-icon color="primary">{{ mdiArrowExpand }}</v-icon>
              </v-btn>
            </v-img>
          </v-hover>

          <div class="mx-2 d-flex align-start flex-column">
            <div class="d-flex align-center line-clamp-1">
              <span class="text-subtitle-2"> {{ track?.name }} · </span>

              <span class="text-caption font-weight-bold text-secondary"> {{ track.meta?.type }} · </span>

              <span class="text-caption font-weight-bold text-secondary">
                {{ `${Math.ceil((track.meta?.br ?? 0) / 1000)}` }}kbps
              </span>
            </div>

            <artists-link :artists="track?.ar" class="text-caption" />
          </div>
          <like-toggle :id="track?.id" />
          <v-spacer />
        </div>
        <Control />
        <div class="playing-bar__right">
          <v-btn icon size="small" :color="showPipLyric ? 'primary' : ''" @click="togglePipLyric">
            <v-icon ref="playlistBtn" size="small">
              {{ mdiPictureInPictureTopRight }}
            </v-icon>
            <v-tooltip activator="parent" location="top">
              {{ showPipLyric ? $t('common.hide_pip') : $t('common.show_pip') }}
            </v-tooltip>
          </v-btn>
          <div class="volume-bar d-flex align-center mx-2">
            <v-btn icon size="small" @click="toggleMute">
              <v-icon size="small">
                {{ volumeIcon }}
              </v-icon>
            </v-btn>
            <Slider
              v-model="sliderVolume"
              class="playing-volume"
              :max="1"
              :min="0"
              :step="0.01"
              :height="2"
              :color="currentTheme.colors.primary"
              track-color="rgba(66,66,66,0.28)"
              @change="volumnDebouncedFn"
            />
          </div>
          <v-btn icon size="small" :color="isQueue ? 'primary' : ''" @click="toQueue">
            <v-icon ref="playlistBtn" size="small">
              {{ mdiPlaylistMusic }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>
  </transition>
</template>
<script setup lang="ts">
import {
  mdiArrowExpand,
  mdiPictureInPictureTopRight,
  mdiPlaylistMusic,
  mdiVolumeHigh,
  mdiVolumeLow,
  mdiVolumeMedium,
  mdiVolumeMute,
} from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Slider from 'vue3-slider'
import { useTheme } from 'vuetify'

import { useEmojiAnimation } from '@/hooks/useEmojiAnimation'
import useInForeground from '@/hooks/useInForeground'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { formatNumber, sizeOfImage } from '@/util/fn'
// utitlity
const playerStore = usePlayerStore()
const playQueueStore = usePlayQueueStore()
const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const player = usePlayer()
const theme = useTheme()
const currentTheme = computed(() => {
  return theme.current.value
})

// store state
const { currentTime, track, volume, showPipLyric } = storeToRefs(playerStore)
const trackDt = computed(() => track.value?.dt ?? 10)
const albumPicUrl = computed(() => sizeOfImage(track.value?.al?.picUrl ?? '', 128))

const cacheVolume = ref(0.8)
const sliderVolume = ref(0)
sliderVolume.value = volume.value

// 音量icon状态
const volumeIcon = computed(() => {
  if (volume.value === 0) {
    return mdiVolumeMute
  } else if (volume.value > 0 && volume.value <= 0.3) {
    return mdiVolumeLow
  } else if (volume.value > 0.3 && volume.value <= 0.6) {
    return mdiVolumeMedium
  } else {
    return mdiVolumeHigh
  }
})

// 播放并开启飞越小动画
const playlistBtn = ref<HTMLButtonElement>()
const { playAnimation } = useEmojiAnimation(playlistBtn)
const eventBus = useEventBus<number>('addToQueue')
eventBus.on((id, setQueue) => {
  player.updatePlayerTrack(id)
  playAnimation('🎉')
  if (setQueue) {
    playQueueStore.setQueue(id)
  }
})

// 跳转播放列表

const { isActive: isQueue } = useInForeground('queue')
function toQueue() {
  if (isQueue.value) {
    router.back()
  } else {
    router.push('/queue')
  }
}

// 进度条拖拽
async function dragStart() {
  await nextTick()
  player.pauseProgress()
}

async function dragEnd(value: number) {
  player.setSeek(value)
  // 恢复
  await nextTick()
  player.restoreProgress()
  // state.displayTime = playerTime
}
// 音量调整
function toggleMute() {
  if (volume.value === 0) {
    sliderVolume.value = cacheVolume.value
    volume.value = cacheVolume.value
  } else {
    cacheVolume.value = volume.value
    volume.value = 0
    sliderVolume.value = 0
  }
}

// 桌面歌词
function togglePipLyric() {
  if (!showPipLyric.value) {
    player.pipLyric?.enter()
  } else {
    player.pipLyric?.leave()
  }
}
player.pipLyric!.onLeave = function () {
  console.log('on leave')
  showPipLyric.value = false
}
player.pipLyric!.onEnter = function () {
  console.log('on enter')
  showPipLyric.value = true
}

function showPlayingPage() {
  appStore.showLyric = true
}
const volumnDebouncedFn = useDebounceFn(
  (val: Event | number) => {
    volume.value = val as number
  },
  200,
  { maxWait: 1000 }
)
</script>

<style lang="scss" scoped>
.player-footer {
  bottom: 0;
  width: 100vw;
  z-index: 1007;
  display: flex;
  flex-flow: column nowrap;
  overflow: visible;
  padding: 0 12px;
  :deep(.v-toolbar__content) {
    padding: 8px 0;
  }

  .playing-control {
    display: flex;
    width: 100%;

    .playing-bar__left {
      display: flex;
      flex: 1;
      align-items: center;
    }

    .playing-bar__right {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      .volume-bar {
        width: 100%;
        max-width: 165px;
      }
    }
  }
  .track-slider {
    position: absolute;
    top: -5px;
    :deep(.handle) {
      width: 6px;
      height: 6px;
      border-radius: 6px;
      top: -2px;
    }
  }
}
</style>
