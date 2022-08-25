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
          <div v-if="enableLyric" class="frame-content-lyric">
            <ul ref="lyricContainer" class="frame-lyrics my-4 text-xl-h6 text-lg-subtitle-2">
              <li>&nbsp;</li>
              <li
                v-for="(item, index) in lyric"
                :key="index"
                :aria-time="item.time"
                class="mb-2"
                :class="{
                  active: index === state.activeIdx,
                }"
                :style="{ color: index === state.activeIdx ? 'rgb(var(--v-theme-primary))' : '' }"
                v-html="item.sentence"
              ></li>
              <li>&nbsp;</li>
            </ul>
          </div>

          <v-card v-else class="rounded-lg" min-height="200" width="100%">
            <v-img class="cover-img rounded-lg" :src="albumPicUrl" />
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
        <like-toggle :id="track?.id" />
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
import { findIndex } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import TrackSlider from '@/components/TrackSlider.vue'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { formatDuring, formatLyric } from '@/util/fn'

const router = useRouter()

const playerStore = usePlayerStore()
const appStore = useAppStore()
const { currentTime, track } = storeToRefs(playerStore)
const { showLyric } = storeToRefs(appStore)
const settingStore = useSettingStore()
const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})
const lyricContainer = ref()
const state = reactive({
  activeIdx: -1,
  interval: null as unknown as NodeJS.Timeout,
  showLyr: false,
})
const albumPicUrl = computed(() => track.value?.al?.picUrl)
const album = computed(() => track.value?.al ?? {})
const lyric = computed(() => {
  const { tlyric, lrc } = track.value?.lyric ?? {}
  let lyric = lrc?.lyric ? formatLyric(lrc.lyric) : []
  let _tlyric = tlyric?.lyric ? formatLyric(tlyric.lyric) : []
  if (_tlyric.length) {
    return lyric.map((i) => {
      return {
        sentence: `${i.sentence}`,
        time: i.time,
      }
    })
  } else {
    return lyric
  }
})

const enableLyric = computed(() => {
  return lyric.value.length && state.showLyr
})

watch(showLyric, (val) => {
  if (val) {
    if (val) {
      init()
    } else {
      clearInterval(state.interval)
    }
  }
})

watchEffect(() => {
  init()
})

onMounted(() => {
  clearInterval(state.interval)
})
function init() {
  initInterval()
}

function initInterval() {
  if (enableLyric.value) {
    state.interval = setInterval(() => {
      calculate()
    }, 500)
  }
}
async function calculate() {
  const current = currentTime.value
  const prevActiveIdx = state.activeIdx
  const activeIdx = findIndex(lyric.value, (o, idx) => {
    const next = lyric.value[idx + 1]
    return (next ? current < next.time : true) && current >= o.time
  })
  state.activeIdx = activeIdx
  // 当前歌词渲染后计算滚动位置
  await nextTick()
  if (activeIdx >= 0 && prevActiveIdx !== activeIdx) {
    const container = lyricContainer.value
    const activeEl = container.querySelector('.frame-lyrics .active')
    if (activeEl) {
      // const offset = await goto(activeEl, {
      //   lyricContainer,
      // })
      // console.log('lyric scroll to ' + offset)
      startScroll(activeEl, container)
    }
  }
}
function startScroll(el: Element, container: HTMLElement) {
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  console.debug('自动滚动高度：', container.scrollTop)
  // this.autoScrollLocation = container.scrollTop // 缓存滚动后的位置
}
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
    .frame-content-lyric {
      max-height: calc(100vw - 40px);
      overflow-y: auto;
      .frame-lyrics {
        height: calc(100% - 40px);
        position: relative;
        z-index: 1;
        padding-left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        li {
          text-align: center;
          list-style: none;
        }
      }
      .before {
        top: 38px;
        left: 0;
        right: 0;
        position: absolute;
        height: 30px;
        z-index: 2;
      }
      .after {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        height: 36px;
        z-index: 2;
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
