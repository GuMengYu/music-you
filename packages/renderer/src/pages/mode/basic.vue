<template>
  <v-card :color="_theme.background" class="basic-container">
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
        <v-card
          class="rounded-lg album-cover my-4"
          max-height="calc(100vh - 315px)"
          max-width="calc(100vh - 315px)"
          min-height="calc(100vh - 315px)"
          width="100%"
        >
          <v-img class="cover-img rounded-lg" :src="albumPicUrl" />
        </v-card>
        <div class="control_bar d-flex flex-column justify-space-between mb-4">
          <div class="d-flex justify-space-between">
            <div class="left d-flex flex-column">
              <span class="text-body-1 font-weight-bold">{{ track.name }}</span>
              <artists-link :artists="track.ar" />
            </div>
          </div>
          <div class="control_process mt-2">
            <v-slider
              :model-value="currentTime * 1000"
              thumb-label
              :min="0"
              :max="trackDt"
              class="track-slider"
              density="compact"
              :track-size="2"
              track-color="#fff"
              :thumb-size="8"
              thumb-color="#fff"
              :hide-details="true"
            />
            <div class="time-info d-flex justify-space-between text-caption">
              <span>{{ currentTime * 1000 }}</span>
              <span>{{ track.dt }}</span>
            </div>
          </div>
          <control class="justify-space-between" />
          <div class="d-flex justify-space-between mt-2">
            <v-btn icon variant="text" @click="state.showLyr = !state.showLyr">
              <v-icon small>
                {{ mdiPodcast }}
              </v-icon>
            </v-btn>
            <v-btn
              v-if="lyric.length"
              variant="text"
              icon
              :color="state.showLyr ? theme.primary : void 0"
              @click="state.showLyr = !state.showLyr"
            >
              <v-icon size="small">
                {{ mdiCommentQuoteOutline }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-card v-if="enableLyric" class="frame-content-lyric pa-4" :color="theme.surfaceVariant">
        <div class="d-flex justify-space-between align-center">
          <span class="font-weight-bold text-subtitle-2">{{ $t('common.lyric') }}</span>
          <!--          <v-btn-->
          <!--            x-small-->
          <!--            rounded-->
          <!--            class="text-caption"-->
          <!--            :color="theme.onSurfaceVariant"-->
          <!--            outlined-->
          <!--            >更多<v-icon x-small class="ml-1">{{-->
          <!--              icon.mdiArrowExpand-->
          <!--            }}</v-icon></v-btn-->
          <!--          >-->
        </div>
        <div class="before" :style="beforeMaskImages"></div>
        <ul ref="lyricContainer" class="frame-lyrics my-4 text-xl-h6 text-lg-subtitle-1 font-weight-bold">
          <li>&nbsp;</li>
          <li
            v-for="(item, index) in lyric"
            :key="index"
            :aria-time="item.time"
            class="mb-2"
            :class="{
              active: index === state.activeIdx,
            }"
            :style="{ color: index === state.activeIdx ? theme.primary : '' }"
            v-html="item.sentence"
          ></li>
          <li>&nbsp;</li>
        </ul>
        <div class="after" :style="afterMaskImages"></div>
      </v-card>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { mdiChevronDown, mdiCommentQuoteOutline, mdiDotsHorizontal, mdiPodcast } from '@mdi/js'
import { findIndex } from 'lodash-es'
import { generatePaletteFromURL } from 'md3-theme-generator'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useTheme } from 'vuetify'

import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { formatLyric } from '@/util/fn'
const playerStore = usePlayerStore()
const appStore = useAppStore()
const theme = useTheme()
const { currentTime, track } = storeToRefs(playerStore)
const { showLyric } = storeToRefs(appStore)
const trackDt = computed(() => track.value?.dt ?? 0)

const lyricContainer = ref()
const state = reactive({
  activeIdx: -1,
  interval: null,
  showLyr: true,
  palette: {
    light: {},
    dark: {},
  },
})
const albumPicUrl = computed(() => track.value?.al?.picUrl)
const album = computed(() => track.value?.al ?? {})
const lyric = computed(() => {
  const { tlyric, lrc } = track.value.lyric ?? {}
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

const _theme = computed(() => {
  return theme.current.value.dark ? state.palette.dark : state.palette.light
})

const beforeMaskImages = computed(() => {
  return {
    'background-image': `linear-gradient(-180deg, ${_theme.value.surfaceVariant} 60%, transparent 100%)`,
  }
})
const afterMaskImages = computed(() => {
  return {
    'background-image': `linear-gradient(0deg, ${_theme.value.surfaceVariant} 60%, transparent 100%)`,
  }
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
  initColor(track.value?.id)
})

onMounted(() => {
  clearInterval(state.interval)
})
function init() {
  // initInterval()
  initColor()
}
async function initColor() {
  if (!albumPicUrl.value) {
    return
  }
  const palette = await generatePaletteFromURL(albumPicUrl.value)
  state.palette.light = palette.light
  state.palette.dark = palette.dark
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
function startScroll(el, container) {
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  console.debug('自动滚动高度：', container.scrollTop)
  // this.autoScrollLocation = container.scrollTop // 缓存滚动后的位置
}
function close() {
  showLyric.value = false
}
</script>

<style lang="scss" scoped>
.basic-container {
  width: 100%;
  .frame {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 20px 25% 20px 25%;
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
      .control_bar {
        width: 100%;
      }
      .frame-content {
        flex: 1;
        .left-container {
          max-width: 30vw;
          //.album-cover {
          //  box-shadow: 4px 9px 20px #403e3e, -7px -6px 20px #565454;
          //}
        }
      }
    }
    .frame-content-lyric {
      height: 50vh;
      .frame-lyrics {
        height: calc(100% - 40px);
        position: relative;
        z-index: 1;
        overflow-y: hidden;
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
</style>
