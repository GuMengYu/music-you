<template>
  <transition name="slide-fade-y">
    <v-app-bar v-if="track?.id" location="bottom" fixed class="player-footer px-2" :order="1" height="56" flat>
      <TrackSlider class="track-slider" />
      <div class="playing-control" @click="showPlayingPage">
        <div class="playing-bar__left">
          <v-img
            class="rounded"
            :aspect-ratio="1"
            :min-width="40"
            :max-width="40"
            :max-height="40"
            :src="albumPicUrl"
            cover
          >
          </v-img>

          <div class="mx-2 d-flex align-start text-caption">
            <span class="font-weight-bold"> {{ track?.name }} - </span>
            <artists-link :artists="track?.ar" class="line-clamp-1" />
          </div>
        </div>
        <div class="playing-bar__right">
          <v-btn
            size="small"
            icon
            class="play-fab"
            color="primary"
            :loading="loadingTrack"
            variant="flat"
            @click.stop="togglePlay"
          >
            <lottie-icon
              v-show="!loadingTrack"
              class="lottie-icon"
              style="position: relative; top: 1px"
              :options="playOptions"
              :width="24"
              :height="24"
              @anim-created="handleAnimation"
            ></lottie-icon>
          </v-btn>
          <v-btn icon size="small" :color="isQueue ? 'primary' : ''" :disabled="isCurrentFm" @click.stop="toQueue">
            <v-icon size="small">
              {{ mdiPlaylistMusic }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-app-bar>
  </transition>
</template>
<script setup lang="ts">
import { mdiPlaylistMusic } from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import TrackSlider from '@/components/TrackSlider.vue'
import { useEmojiAnimation } from '@/hooks/useEmojiAnimation'
import useInForeground from '@/hooks/useInForeground'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { playToPause as playToPauseAnimationData } from '@/util/animationData.json'
import { sizeOfImage } from '@/util/fn'

// utitlity
const playerStore = usePlayerStore()
const playQueueStore = usePlayQueueStore()
const appStore = useAppStore()
const router = useRouter()
const player = usePlayer()
const theme = useTheme()

// store state
const { track, volume, isCurrentFm, playing, loadingTrack } = storeToRefs(playerStore)
const albumPicUrl = computed(() => sizeOfImage(track.value?.al?.picUrl ?? '', 128))

const sliderVolume = computed({
  get() {
    return volume.value
  },
  set(val) {
    volume.value = val
  },
})
sliderVolume.value = volume.value

// 跳转播放列表

const { isActive: isQueue } = useInForeground('queue')
function toQueue() {
  if (isQueue.value) {
    router.back()
  } else {
    router.push('/queue')
  }
}

async function showPlayingPage() {
  appStore.showLyric = true
}

const togglePlay = () => {
  playing.value = !playing.value
}
const playAnim = ref()
const playOptions = {
  animationData: playToPauseAnimationData,
  loop: false,
  autoplay: false,
}
watch(playing, (val) => {
  if (val) {
    playAnim.value?.playSegments([0, 30], true)
  } else {
    playAnim.value?.playSegments([30, 60], true)
  }
})
function handleAnimation(animation) {
  playAnim.value = animation
  playAnim.value.setSpeed(2)
}
</script>

<style lang="scss" scoped>
.player-footer {
  bottom: 0;
  width: 100vw;
  z-index: 1007;
  display: flex;
  flex-flow: column nowrap;
  overflow: visible;

  .playing-control {
    cursor: pointer;
    display: flex;
    width: 100%;
    justify-content: space-between;

    .playing-bar__left {
      display: flex;
      align-items: center;
    }

    .playing-bar__right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  .track-slider {
    position: absolute;
    bottom: -10px;
  }
}
</style>
