<template>
  <v-card class="frame">
    <div class="frame-header d-flex justify-space-between drag-area pa-2">
      <span class="ml-4 mt-4 frame-header-title text-lg-h2 text-md-h3 text-xl-h1 text-sm-h4 text-onSurfaceVariant">
        {{ formatDuring(track!.dt) }} /
        {{ formatDuring(currentTime * 1000) }}
      </span>
      <div class="frame-header-action d-flex no-drag-area flex-column">
        <v-btn icon variant="text" @click="close">
          <v-icon>
            {{ icon.mdiClose }}
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="frame-content text-onSurfaceVariant mx-6">
      <lyric />
      <v-img
        max-height="50vh"
        min-height="50vh"
        max-width="50vh"
        min-width="50vh"
        class="frame-cover-img rounded-lg"
        :src="albumPicUrl"
        :lazy-src="placeholderUrl"
        :aspect-ratio="1"
      />
    </div>
    <div class="frame-footer text-onSurfaceVariant mb-6 mx-6 d-flex flex-column gap-4">
      <span class="text-h4">{{ track!['al'] && track!['al']['name'] }}</span>
      <span class="text-h4">by - {{ track!['ar'] && track!['ar'][0]['name'] }}</span>
      <div class="d-flex justify-space-between align-center">
        <span class="text-h2 line-clamp-1" style="max-width: 60vw">
          {{ track!.name }}
        </span>
        <div>
          <v-btn icon variant="text" @click="prev">
            <v-icon size="56">
              {{ icon.mdiChevronLeft }}
            </v-icon>
          </v-btn>
          <v-btn icon variant="text" class="ml-4" @click="next">
            <v-icon size="56">
              {{ icon.mdiChevronRight }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import {
  mdiArrowCollapse,
  mdiArrowExpand,
  mdiChevronLeft,
  mdiChevronRight,
  mdiClose,
  mdiCommentQuoteOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiPauseCircle,
  mdiPodcast,
  mdiRepeat,
  mdiShuffle,
} from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'

import placeholderUrl from '@/assets/placeholder.png'
import Lyric from '@/pages/mode/components/lyric.vue'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import type { Artist, Track } from '@/types'
import { formatDuring, sizeOfImage } from '@/util/fn'
import is from '@/util/is'
export default defineComponent({
  components: { Lyric },
  setup() {
    const playerStore = usePlayerStore()
    const appStore = useAppStore()
    const player = usePlayer()

    const { currentTime, track } = storeToRefs(playerStore)

    const albumPicUrl = computed(() => {
      return track.value?.al && sizeOfImage(track.value.al.picUrl)
    })
    async function close() {
      if (is.electron()) {
        const ipcRenderer = useIpcRenderer()
        await ipcRenderer.invoke('restoreSize')
      }
      appStore.showLyric = false
    }
    function prev() {
      player.prev()
    }
    function next() {
      player.next()
    }
    return {
      currentTime,
      track,
      formatDuring,
      close,
      prev,
      next,
      albumPicUrl,
      placeholderUrl,
    }
  },
  data: () => ({
    icon: {
      mdiHeart,
      mdiDotsHorizontal,
      mdiShuffle,
      mdiChevronLeft,
      mdiChevronRight,
      mdiRepeat,
      mdiPauseCircle,
      mdiPodcast,
      mdiCommentQuoteOutline,
      mdiArrowExpand,
      mdiArrowCollapse,
      mdiClose,
    },
    activeIdx: -1,
    showLyric: true,
  }),
})
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
    // &-title {
    //   font-family: AaLanSong, serif !important;
    // }
    &-action {
      gap: 5px;
    }
  }
  &-content {
    z-index: 2;
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: space-between;
  }
  &-footer {
    z-index: 2;
    display: flex;
    // span {
    //   font-family: AaLanSong, serif !important;
    // }
  }
  &-play-progress {
    position: absolute;
    z-index: 0;
    right: -100vw;
    height: 2px;
    bottom: 0;
    background: var(--v-primary-base);
    opacity: 0.8;
    min-width: 4px;
    transition: transform 3s linear;
    width: 100vw;
  }
}
</style>
