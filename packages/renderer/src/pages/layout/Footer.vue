<template>
  <transition name="slide-fade-y">
    <v-footer v-show="track?.id" fixed class="player-footer">
      <v-slider
        :model-value="currentTime * 1000"
        thumb-label
        :min="0"
        :max="trackDt"
        class="track-slider"
        density="compact"
        :track-size="2"
        :thumb-size="12"
        :hide-details="true"
        color="primary"
      ></v-slider>
      <div class="playing-control">
        <div class="playing-bar__left">
          <v-img class="rounded-lg" :aspect-ratio="1" :max-width="40" :max-height="40" :src="albumPicUrl" cover></v-img>
          <div class="song-info mx-4 d-flex align-center">
            <span class="song-name h-1x text-subtitle-2">
              {{ track?.name }}
            </span>
            <span class="text--disabled mx-2">-</span>
            <artists-link :artists="track?.ar" class="text-caption" />
          </div>
          <like-toggle :id="track?.id" />
          <v-spacer />
        </div>
        <div class="playing-bar__center justify-center">
          <Control />
        </div>
        <div class="playing-bar__right">
          <div class="volume-bar d-flex align-center">
            <v-btn icon variant="plain" size="small">
              <v-icon size="small">
                {{ mdiVolumeHigh }}
              </v-icon>
            </v-btn>
            <v-slider
              :model-value="volume"
              class="playing-volume"
              density="compact"
              :track-size="2"
              :thumb-size="12"
              hide-details
              :max="1"
              min="0"
              step="0.1"
              color="primary"
            />
          </div>
          <v-btn icon variant="plain" size="small" :color="isQueue ? 'primary' : ''" @click="toQueue">
            <v-icon ref="playlistBtn" size="small">
              {{ mdiPlaylistMusic }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-footer>
  </transition>
</template>
<script setup lang="ts">
import { mdiPlaylistMusic, mdiVolumeHigh } from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useEmojiAnimation } from '@/hooks/useEmojiAnimation'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()
const router = useRouter()
const route = useRoute()
const player = usePlayer()
const { currentTime, track, volume = 0.8 } = storeToRefs(playerStore)

const trackDt = computed(() => track.value?.dt ?? 0)
const albumPicUrl = computed(() => track.value?.al?.picUrl)

const isQueue = computed(() => {
  return route.name === 'queue'
})

// 播放飞越小动画
const playlistBtn = ref<HTMLButtonElement>()
const { playAnimation } = useEmojiAnimation(playlistBtn)
const eventBus = useEventBus<string>('addToQueue')
eventBus.on((id) => {
  player.updatePlayerTrack(id)
  playAnimation('🎉')
})

function toQueue() {
  if (isQueue.value) {
    router.back()
  } else {
    router.push('/queue')
  }
}
</script>

<style lang="scss" scoped>
.player-footer {
  bottom: 0;
  width: 100vw;
  z-index: 1007;
  display: flex;
  flex-flow: column nowrap;
  padding: 12px;
  .track-slider {
    width: 100%;
    position: absolute;
    top: -8px;
    left: 0;
    :deep(.v-input__control) {
      min-height: 16px;
    }
  }

  .playing-control {
    display: flex;
    width: 100%;

    .playing-bar__left {
      display: flex;
      flex: 1;
    }

    .playing-bar__center {
      display: flex;
      flex: 1;
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
}
</style>
