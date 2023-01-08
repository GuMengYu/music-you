<script setup lang="ts">
import { findIndex } from 'lodash-es'
import { storeToRefs } from 'pinia'

import useTrackLyric from '@/hooks/useTrackLyric'
import { usePlayerStore } from '@/store/player'

const { currentTime, track } = storeToRefs(usePlayerStore())

const lyricContainer = ref()

const props = defineProps({
  enableLyric: {
    type: Boolean,
    default: true,
  },
})
const state = reactive({
  activeIdx: -1,
  interval: null as unknown as NodeJS.Timeout,
  showLyr: false,
})

const { lyrics } = useTrackLyric()

onMounted(() => {
  clearInterval(state.interval)
  startInterval()
})
onUnmounted(() => {
  clearInterval(state.interval)
})
function startInterval() {
  if (props.enableLyric) {
    state.interval = setInterval(() => {
      calculate()
    }, 500)
  }
}
async function calculate() {
  const current = currentTime.value
  const prevActiveIdx = state.activeIdx
  const activeIdx = findIndex(lyrics.value, (o, idx) => {
    const next = lyrics.value[idx + 1]
    return (next ? current < next.time : true) && current >= o.time
  })
  state.activeIdx = activeIdx
  // 当前歌词渲染后计算滚动位置
  await nextTick()
  if (activeIdx >= 0 && prevActiveIdx !== activeIdx) {
    const container = lyricContainer.value
    const activeEl = container?.querySelector('.frame-lyrics .active')
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}
function isActive(index: number) {
  return index === state.activeIdx
}
</script>
<template>
  <div class="frame-content-lyric">
    <ul ref="lyricContainer" class="frame-lyrics my-4 text-xl-h6 text-body-2">
      <li>&nbsp;</li>
      <li
        v-for="(item, index) in lyrics"
        :key="index"
        :aria-time="item.time"
        class="mb-2"
        :class="{
          active: isActive(index),
          'font-weight-bold': isActive(index),
          'text-xl-h5 text-body-1': isActive(index),
        }"
        :style="{ color: index === state.activeIdx ? 'rgb(var(--v-theme-primary))' : '' }"
        v-html="item.sentence"
      ></li>
      <li>&nbsp;</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.frame-content-lyric {
  height: 100%;
  overflow-y: auto;
  position: relative;
  .frame-lyrics {
    height: calc(100% - 40px);
    position: relative;
    z-index: 1;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    li {
      font-family: 'Google Sans', serif !important;
      text-align: center;
      list-style: none;
      transition: font-size 0.35s ease-out;
    }
  }
}
</style>
