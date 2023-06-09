<script setup lang="ts">
import { storeToRefs } from 'pinia'

import type { Lyric } from '@/hooks/useTrackLyric'
import useTrackLyric from '@/hooks/useTrackLyric'
import { usePlayerStore } from '@/store/player'
import { sleep } from '@/util/fn'
const playerStore = usePlayerStore()
const { currentTime, track } = storeToRefs(playerStore)

const { lyrics } = useTrackLyric()
const currentLyric = computed(() => {
  if (lyrics.value.length) {
    const past = lyrics.value.filter((i) => i.time < currentTime.value)
    const current = lyrics.value[past.length - 1]
    if (!current) {
      currentText.value = lyrics.value[0].sentence
      return lyrics.value[0]
    } else {
      return current
    }
  }
  return null
})
const currentText = ref('')
watch(currentLyric, (val) => {
  val && switchText(val)
})
const text = ref<HTMLElement>()
const animate = ref(false)
async function switchText(lyric: Lyric) {
  if (lyric.sentence) {
    animate.value = true
    currentText.value = lyric.sentence
    await sleep(350)
    animate.value = false
  }
}

const displayAll = ref(false)
</script>
<template>
  <div class="lyrics-wrapper">
    <div class="lyrics-slider">
      <span v-if="!currentLyric" class="current">
        {{ $t('common.no_lyric') }}
      </span>
      <span v-else ref="text" class="current" :class="{ animate }" @click="displayAll = true" v-html="currentText">
      </span>
    </div>

    <v-dialog v-model="displayAll" scrollable max-height="70vh">
      <v-card
        color="surfaceVariant"
        width="45vw"
        class="text-onSurfaceVariant rounded-xl pa-4 overflow-y-auto align-self-center"
      >
        <ul class="lyrics-list text-xl-h6 text-lg-subtitle-1">
          <li v-for="(item, index) in lyrics" :key="index" :data-time="item.time" v-html="item.sentence"></li>
        </ul>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped lang="scss">
.lyrics-wrapper {
  .current {
    display: inline-block;
    animation-duration: 0.4s;
    animation-timing-function: ease-in-out;
    animation-fill-mode: both;
    // font-family: AaLanSong, serif !important;
  }
}
.animate {
  animation-name: lyric;
}
.lyrics-list {
  position: relative;
  z-index: 1;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
  li {
    // font-family: AaLanSong, serif !important;
    text-align: center;
    list-style: none;
  }
}
</style>
