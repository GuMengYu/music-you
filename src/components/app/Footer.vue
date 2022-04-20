<template>
  <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
  >
    <v-footer fixed class="player-footer">
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
          <v-img
              class="rounded"
              :aspect-ratio="1"
              :max-width="40"
              :max-height="40"
              :src="albumPicUrl"
              cover
          ></v-img>
          <div class="song-info mx-2 d-flex align-center">
            <span class="song-name h-1x text-subtitle-2">
              {{ track.name }}
            </span>
            <span class="text--disabled mx-2">-</span>
          </div>
          <v-btn icon variant="plain" size="small">
            <v-icon size="x-small">
              {{ mdiHeart }}
            </v-icon>
          </v-btn>

          <v-spacer/>
        </div>
        <div class="playing-bar__center justify-center">
          <music-control />
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
          <v-btn
              icon variant="plain" size="small"
          >
            <v-icon size="small">
              {{ mdiPlaylistMusic }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-footer>
  </transition>
</template>
<script setup lang="ts">
import { mdiPlaylistMusic, mdiHeart, mdiVolumeHigh } from "@mdi/js"
import {computed, reactive, ref} from 'vue'
import { throttle } from "lodash-es";
import { storeToRefs } from "pinia"
import { usePlayerStore } from "@/store/player"
import MusicControl from '@components/app/control/Control.vue'

const playerStore = usePlayerStore()
const { currentTime, track, volume = 0.8 } = storeToRefs(playerStore)


const trackDt = computed(() => track.value.dt ?? 0)
const albumPicUrl = computed(() => track.value.al.picUrl)


// const sliderValue = ref<number>(0)
//
// const doSeek = throttle((time) => {
//   sliderValue.value = time
//   console.log('doSeek', time)
// }, 1000)

</script>

<style lang="scss" scoped>
.player-footer {
  bottom: 0;
  width: 100vw;
  z-index: 9999;
  display: flex;
  flex-flow: column nowrap;

  .track-slider {
    width: 100%;

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
