<template>
  <v-card class="text-onSurfaceVariant" :theme="currentTheme">
    <v-layout>
      <v-main class="frame" @contextmenu="handleContextMenu">
        <v-img
          class="background"
          cover
          :src="useTrackCover ? coverUrl : currentWallpaper?.['path']"
          :class="{
            loaded: !loading,
            loading: loading,
          }"
          :style="backgroundFilter"
          @load="onLoad"
          @error="onError"
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
          <scroll-lyric v-if="displayLyric" />
        </div>
        <div class="frame-footer d-flex flex-column px-2 px-xl-4 gap-4 mt-auto">
          <div class="d-flex gap-4 mx-2">
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
              <template v-if="track?.['al']">
                <span><album-link :album="track['al']" /> - <artists-link :artists="track['ar']" /></span>
              </template>

              <span class="text-h4 text-xl-h3 font-weight-regular"
                >{{ track?.name }} <download-track-btn :track="track as Track" />
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
              <span class="d-flex justify-center" style="width: 65px">{{ formatDuring(track?.['dt']) }}</span>
            </div>

            <div class="d-flex align-center">
              <template v-if="!isProgram && track?.id">
                <like-toggle :id="track['id']" />
                <music-comment-toggle :id="track['id']" />
              </template>

              <v-btn icon variant="text" @click="toggleLyricDisplay">
                <v-icon>
                  {{ displayLyric ? mdiLyricsOutline : mdiLyrics }}
                </v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ displayLyric ? '关闭歌词显示' : '开启歌词显示' }}
                </v-tooltip>
              </v-btn>
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
import { mdiChevronLeft, mdiChevronRight, mdiClose, mdiImageMultipleOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import placeholderUrl from '@/assets/placeholder.png'
import { useDownload, useDownloadMusic } from '@/hooks/useDownload'
import usePlayerControl from '@/hooks/usePlayerControl'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import WallHaven from '@/pages/modal/Wallhaven.vue'
import ScrollLyric from '@/pages/mode/components/ScrollLyric.vue'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { useWallHavenStore } from '@/store/wallhaven'
import { Track } from '@/types'
import { formatDuring, sizeOfImage, sleep } from '@/util/fn'
import { mdiLyrics, mdiLyricsOutline } from '@/util/icons'

const playerStore = usePlayerStore()
const appStore = useAppStore()
const settingStore = useSettingStore()
const wallHavenStore = useWallHavenStore()
const contextMenu = useContextMenu()
const loading = ref(false)
const { showLyric, showHaven } = storeToRefs(appStore)
const { currentTime } = storeToRefs(playerStore)
const { track, isProgram } = usePlayerControl()
const { wallpapers, currentWallpaper, currentIndex, brightness, blur, useTrackCover } = storeToRefs(wallHavenStore)
const { themeName } = useCurrentTheme()

const coverUrl = computed(() => sizeOfImage(track.value?.coverUrl ?? track.value?.al?.picUrl ?? '', 1024))

const currentTheme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})

const backgroundFilter = computed(() => {
  return {
    filter: `brightness(${brightness.value}%) blur(${blur.value}px)`,
  }
})
const displayLyric = ref(true)

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

function toggleLyricDisplay() {
  displayLyric.value = !displayLyric.value
}

async function onLoad() {
  await nextTick()
  loading.value = false
}
function onError() {
  loading.value = false
}

function handleContextMenu(event: MouseEvent) {
  if (!track.value) {
    return
  }
  const { toPlaylistMenuItems } = useTrackOperation(track.value)
  const { x, y } = event
  const option = {
    theme: themeName.value,
    x,
    y,
    items: [
      {
        label: '加入歌单',
        children: toPlaylistMenuItems.value,
      },
      {
        divided: true,
      },
      {
        label: '打开背景设置',
        onClick: () => {
          showHaven.value = true
        },
      },
      {
        label: '下载背景图片',
        onClick: () => {
          if (currentWallpaper.value?.path) {
            useDownload(currentWallpaper.value?.path)
          }
        },
      },
      {
        label: '下载当前歌曲',
        onClick: () => {
          if (track?.value?.id) {
            useDownloadMusic(track.value)
          }
        },
      },
    ],
    offsetFooter: 64,
    customClass: 'bg-surfaceVariant',
  }
  contextMenu(option)
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
