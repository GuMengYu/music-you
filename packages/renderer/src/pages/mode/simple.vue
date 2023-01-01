<template>
  <v-card class="frame text-onSurfaceVariant" :theme="currentTheme">
    <v-img
      class="background"
      cover
      :src="currentBackground?.path"
      :class="{
        loaded: !loading,
        loading: loading,
      }"
      @load="onLoad"
      @error="onError"
    >
    </v-img>
    <div class="frame-header" :class="is.macOS() ? 'justify-end' : 'justify-start'">
      <v-btn icon variant="plain" @click="close">
        <v-icon>
          {{ mdiClose }}
        </v-icon>
      </v-btn>
    </div>
    <div class="frame-content d-flex flex-grow-1 justify-center align-center text-center px-8">
      <lyric class="text-h4 text-xl-h3" style="font-family: 'Google Sans', serif !important" />
    </div>
    <div class="frame-footer d-flex flex-column px-4 px-xl-8 gap-4">
      <div class="d-flex gap-4">
        <v-img
          max-height="20vh"
          min-height="20vh"
          max-width="20vh"
          min-width="20vh"
          class="frame-cover-img rounded-lg"
          :src="albumPicUrl"
          :lazy-src="placeholderUrl"
          :aspect-ratio="1"
        />
        <div
          class="d-flex flex-column text-h5 text-xl-h4 justify-space-evenly"
          style="font-family: 'Google Sans', serif !important"
        >
          <span>{{ track['al']?.['name'] }}</span>
          <span>by - {{ track['ar']?.[0]?.['name'] }}</span>
          <span class="text-h4 text-xl-h3 font-weight-regular" style="font-family: 'Google Sans', serif !important">{{
            track?.name
          }}</span>
        </div>
      </div>
      <div class="d-flex justify-space-between align-center mb-4">
        <v-responsive min-width="20vh" max-width="20vh">
          <control simple />
        </v-responsive>
        <div class="d-flex flex-grow-1 px-4">
          <span class="d-flex justify-center" style="width: 65px">{{ formatDuring(currentTime * 1000) }}</span>
          <TrackSlider class="track-slider mx-2" tooltip />
          <span class="d-flex justify-center" style="width: 65px">{{ formatDuring(track.dt) }}</span>
        </div>

        <v-responsive class="d-flex" min-width="20vh" max-width="20vh">
          <div class="d-flex justify-center">
            <music-comment-toggle :id="track.id" />
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
        </v-responsive>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { mdiChevronLeft, mdiChevronRight, mdiClose } from '@mdi/js'
import { storeToRefs } from 'pinia'

import { wallpapers } from '@/api/other'
import placeholderUrl from '@/assets/placeholder.png'
import Lyric from '@/pages/mode/components/lyric.vue'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import type { Wallpaper } from '@/types'
import { formatDuring, sizeOfImage, sleep } from '@/util/fn'
import is from '@/util/is'

const playerStore = usePlayerStore()
const appStore = useAppStore()
const settingStore = useSettingStore()
const player = usePlayer()
const backgrounds = ref<Wallpaper[]>([])
const currentBackground = ref<Wallpaper | undefined>()
const currentIndex = ref(-1)

const loading = ref(false)
const { currentTime, track } = storeToRefs(playerStore)

const albumPicUrl = computed(() => {
  return track.value?.al && sizeOfImage(track.value.al.picUrl)
})
const currentTheme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})
async function close() {
  appStore.showLyric = false
}
function prev() {
  currentBackground.value = backgrounds.value[2]
}
function next() {
  player.next()
}
onMounted(() => {
  loadBackgrounds()
})
async function loadBackgrounds() {
  const walls = await wallpapers()
  if (walls.length) {
    backgrounds.value = walls
    currentIndex.value = 0
    currentBackground.value = backgrounds.value[currentIndex.value]
  }
}
async function loadPrev() {
  loading.value = true
  await nextTick()
  await sleep(350)
  currentBackground.value = void 0
  if (currentIndex.value === 0) {
    currentIndex.value = backgrounds.value.length - 1
  } else {
    currentIndex.value--
  }
  currentBackground.value = backgrounds.value[currentIndex.value]
}
async function loadNext() {
  loading.value = true
  await nextTick()
  await sleep(350)
  currentBackground.value = void 0
  if (currentIndex.value === backgrounds.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value++
  }
  currentBackground.value = backgrounds.value[currentIndex.value]
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
  }
  &-footer {
    z-index: 2;
  }
  .background {
    opacity: 0;
    filter: brightness(0.5);
    position: absolute;
    height: 100vh;
    width: 100vw;
  }
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
