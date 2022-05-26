<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/store/player'
import { formatLyric } from '@/util/fn'
const playerStore = usePlayerStore()
const activeIdx = ref(0)
const { currentTime, track } = storeToRefs(playerStore)
interface Lyric {
  sentence: string
  time: number
}
const lyrics = computed<Lyric[]>(() => {
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
const currentLyric = computed(() => {
  const past = lyrics.value.filter(i => i.time < currentTime.value)
  const current = lyrics.value[past.length - 1]
  // const actived = lyrics.value.find((o, idx) => {
  //   const next = lyrics.value[idx + 1]
  //   return (next ? currentTime.value < next.time : true) && currentTime.value >= o.time
  // })
  return current ?? {}
})
watch(currentLyric, (val) => {
  console.log(val)
})
</script>
<template>
  <div class="lyrics-wrapper">
    {{ currentLyric }}
    <ul ref="lyricContainer" class="lyrics-list text-xl-h6 text-lg-subtitle-1 font-weight-bold text-onSurfaceVariant">
      <li
        v-for="(item, index) in lyrics"
        :key="index"
        :data-time="item.time"
        :class="{
          active: index === activeIdx,
        }"
        v-html="item.sentence"
      ></li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
.lyrics-wrapper {
  .lyrics-list {
    position: relative;
    z-index: 1;
    overflow-y: hidden;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    li {
      text-align: center;
      list-style: none;
    }
  }
}
</style>
