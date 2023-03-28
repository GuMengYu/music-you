<template>
  <v-card :image="albumPicUrl" class="basic-container" :theme="theme">
    <div class="frame">
      <div class="frame-header">
        <v-btn icon variant="text" @click="close">
          <v-icon>
            {{ mdiChevronDown }}
          </v-icon>
        </v-btn>
        <span class="text-caption">{{ album.name }}</span>
        <v-btn icon variant="text">
          <v-icon>
            {{ mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
      <div class="frame-content-info">
        <transition name="slide-up" mode="out-in">
          <scroll-lyric v-if="enableLyric" :enable-lyric="enableLyric" />
          <v-card v-else class="rounded-md" min-height="200" width="100%">
            <v-img class="cover-img rounded-md" :src="albumPicUrl" />
          </v-card>
        </transition>
        <div class="control_process d-flex align-center my-4">
          <span>{{ formatDuring(currentTime * 1000) }}</span>
          <track-slider class="mx-2" />
          <span>{{ formatDuring(track.dt) }}</span>
        </div>
        <div class="control_bar d-flex flex-column flex-fill justify-space-evenly">
          <div class="d-flex justify-center">
            <div class="left d-flex flex-column align-center">
              <span class="text-body-1 font-weight-bold">{{ track.name }}</span>
              <artists-link :artists="track.ar" />
            </div>
          </div>
          <control />
        </div>
      </div>
      <div class="d-flex justify-end">
        <v-btn icon size="small" variant="text" @click="state.showLyr = !state.showLyr">
          <v-icon size="small">
            {{ state.showLyr ? mdiTextBox : mdiTextBoxOutline }}
          </v-icon>
        </v-btn>
        <like-toggle :id="track?.id" size="small" />
        <v-btn icon size="small" variant="text" @click="toQueue">
          <v-icon size="small">
            {{ mdiPlaylistMusic }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { mdiChevronDown, mdiDotsHorizontal, mdiPlaylistMusic, mdiTextBox, mdiTextBoxOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import TrackSlider from '@/components/TrackSlider.vue'
import useTrackLyric from '@/hooks/useTrackLyric'
import ScrollLyric from '@/pages/mode/components/ScrollLyric.vue'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { formatDuring } from '@/util/fn'

const router = useRouter()

const playerStore = usePlayerStore()
const appStore = useAppStore()
const { currentTime, track } = storeToRefs(playerStore)
const { showLyric } = storeToRefs(appStore)
const settingStore = useSettingStore()
const { lyrics } = useTrackLyric()

const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})
const state = reactive({
  showLyr: false,
})
const albumPicUrl = computed(() => track.value?.al?.picUrl)
const album = computed(() => track.value?.al ?? {})

const enableLyric = computed(() => {
  return !!lyrics.value.length && state.showLyr
})

function close() {
  showLyric.value = false
}
function toQueue() {
  router.push('/queue')
  close()
}
</script>

<style lang="scss" scoped>
.basic-container {
  :deep(.v-card__image) {
    filter: blur(140px) brightness(80%);
  }
  .frame {
    padding: 20px;
    position: relative;
    .frame-header {
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .frame-content-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
      flex: 1;
      height: calc(100vh - 136px);
      margin-bottom: 24px;
      .control_process {
        width: 100%;
      }
    }
  }
}
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
