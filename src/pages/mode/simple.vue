<template>
  <v-card class="text-onSurfaceVariant" :theme="currentTheme">
    <v-layout>
      <v-main class="frame">
        <v-img
          class="background"
          cover
          :src="useTrackCover ? coverUrl : currentWallpaper['path']"
          :class="{
            loaded: !loading,
            loading: loading,
          }"
          :style="backgroundFilter"
          @load="onLoad as string"
          @error="onError as string"
        >
        </v-img>
        <div class="frame-header pt-2 px-2 justify-end drag-area">
          <v-btn class="no-drag-area" icon variant="text" @click="close">
            <v-icon>
              {{ mdiClose }}
            </v-icon>
          </v-btn>
        </div>
        <div class="frame-content d-flex justify-center align-center text-center py-4">
          <scroll-lyric />
          <!--      <lyric class="text-h4 text-xl-h3" style="font-family: 'Google Sans', serif !important" />-->
        </div>
        <div class="frame-footer d-flex flex-column pl-4 pr-2 pl-xl-8 pr-xl-4 gap-4 mt-auto">
          <div class="d-flex gap-4">
            <v-img
              max-height="22vh"
              min-height="22vh"
              max-width="22vh"
              min-width="22vh"
              class="frame-cover-img rounded-md"
              :src="coverUrl"
              :lazy-src="placeholderUrl"
              :aspect-ratio="1"
            />
            <div class="d-flex flex-column text-h5 text-xl-h4 justify-space-evenly">
              <template v-if="track['al']">
                <span>{{ track['al']?.['name'] }} - {{ track['ar']?.[0]?.['name'] }}</span>
              </template>

              <span class="text-h4 text-xl-h3 font-weight-regular"
                >{{ track?.name }} <download-track-btn :track="track" />
              </span>
            </div>
          </div>
          <div class="d-flex justify-space-between align-center mb-2">
            <v-responsive min-width="22vh" max-width="22vh">
              <control simple />
            </v-responsive>
            <div class="d-flex flex-grow-1 px-4 font-weight-medium">
              <span class="d-flex justify-center" style="width: 65px">{{ formatDuring(currentTime * 1000) }}</span>
              <TrackSlider class="track-slider mx-2" tooltip />
              <span class="d-flex justify-center" style="width: 65px">{{ formatDuring(track['dt']) }}</span>
            </div>

            <div class="d-flex align-center">
              <template v-if="!isProgram">
                <like-toggle :id="track['id']" />
                <music-comment-toggle :id="track['id']" />
              </template>

              <v-btn icon variant="text" @click="showHaven = !showHaven">
                <v-icon size="small">
                  {{ mdiImageMultipleOutline }}
                </v-icon>
                <v-tooltip activator="parent" location="top"> 当前背景设置 </v-tooltip>
              </v-btn>
              <v-btn icon variant="text" @click="loadPrev">
                <v-icon>
                  {{ mdiChevronLeft }}
                </v-icon>
              </v-btn>
              <v-btn icon variant="text" @click="loadNext">
                <v-icon>
                  {{ mdiChevronRight }}
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-main>
      <wall-haven />
    </v-layout>
  </v-card>
</template>

<script lang="ts" setup>
import { mdiChevronLeft, mdiChevronRight, mdiClose, mdiDotsVertical, mdiImageMultipleOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'

import placeholderUrl from '@/assets/placeholder.png'
import usePlayerControl from '@/hooks/usePlayerControl'
import WallHaven from '@/pages/modal/Wallhaven.vue'
import ScrollLyric from '@/pages/mode/components/ScrollLyric.vue'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { useWallHavenStore } from '@/store/wallhaven'
import { formatDuring, sizeOfImage, sleep } from '@/util/fn'

const playerStore = usePlayerStore()
const appStore = useAppStore()
const settingStore = useSettingStore()
const wallHavenStore = useWallHavenStore()
const player = usePlayer()

const loading = ref(false)
const { showLyric, showHaven } = storeToRefs(appStore)
const { currentTime } = storeToRefs(playerStore)
const { track, isProgram } = usePlayerControl()
const { wallpapers, currentWallpaper, currentIndex, brightness, blur, useTrackCover } = storeToRefs(wallHavenStore)

const coverUrl = computed(() => sizeOfImage(track.value.coverUrl ?? track.value?.al?.picUrl ?? '', 1024))

const currentTheme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})

const backgroundFilter = computed(() => {
  return {
    filter: `brightness(${brightness.value}%) blur(${blur.value}px)`,
  }
})

async function close() {
  showLyric.value = false
}

async function loadPrev() {
  loading.value = true
  await nextTick()
  await sleep(350)
  currentWallpaper.value = void 0
  if (currentIndex.value === 0) {
    currentIndex.value = wallpapers.value.length - 1
  } else {
    currentIndex.value--
  }
}
async function loadNext() {
  loading.value = true
  await nextTick()
  await sleep(350)
  currentWallpaper.value = void 0
  if (currentIndex.value === wallpapers.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
}

async function onLoad() {
  await nextTick()
  loading.value = false
}
function onError() {
  loading.value = false
}
</script>

<style lang="scss" scoped>
.frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  &-header {
    z-index: 2;
    display: flex;
    justify-content: space-between;
  }
  &-content {
    z-index: 2;
    max-height: calc(78vh - 130px);
  }
  &-footer {
    z-index: 2;
  }
}
.background {
  opacity: 0;
  position: absolute;
  height: 100vh;
  width: 100vw;
}
.loaded {
  animation-name: slide-in;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}
.loading {
  animation-name: slide-out;
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}
@keyframes slide-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-15px);
  }
}
@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(15px);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
