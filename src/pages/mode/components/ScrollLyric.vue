<script setup lang="ts">
import { findIndex } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { scrollIntoView } from 'seamless-scroll-polyfill'

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
  const current = currentTime.value - 0.5
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
    const activeEl = container?.querySelector('.lyrics .active')
    if (activeEl) {
      scrollIntoView(activeEl, { block: 'center', behavior: 'smooth' })
      // activeEl.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}
function isActive(index: number) {
  return index === state.activeIdx
}
</script>
<template>
  <div class="scroll-lyric">
    <ul ref="lyricContainer" class="lyrics text-xl-h5 text-h6">
      <li>&nbsp;</li>
      <li
        v-for="(item, index) in lyrics"
        :key="index"
        :aria-time="item.time"
        class="mb-4 px-8"
        :class="{
          active: isActive(index),
        }"
        :style="{ color: isActive(index) ? 'rgb(var(--v-theme-primary))' : '' }"
        v-html="item.sentence"
      ></li>
      <li>&nbsp;</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.scroll-lyric {
  height: 100%;
  width: 100%;
  overflow-y: auto;
  position: relative;
  .lyrics {
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
      transition: transform 0.75s cubic-bezier(0.55, -0.01, 0, 1.03);
      &.active {
        transform: scale(1.3);
      }
    }
  }
}
</style>
