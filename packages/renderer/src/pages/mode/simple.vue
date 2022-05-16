<template>
  <v-card class="frame" color="surfaceVariant">
    <div class="frame-header d-flex justify-space-between mt-6 drag-area px-4">
      <span
        class="frame-header-title font-weight-bold text-lg-h2 text-md-h3 text-xl-h1 text-sm-h4 onSurfaceVariant--text"
      >
        {{ track.dt }} /
        {{ currentTime * 1000 }}
      </span>
      <div class="frame-header-action d-flex no-drag-area flex-column">
        <v-btn icon color="onPrimary" variant="text" @click="close">
          <v-icon>
            {{ icon.mdiClose }}
          </v-icon>
        </v-btn>
        <v-btn icon variant="text">
          <v-icon color="onPrimary">
            {{ icon.mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
    </div>
    <div class="frame-content onSurfaceVariant--text">
      <v-img max-height="200" max-width="200" class="frame-cover-img rounded" :src="albumPicUrl" />
    </div>
    <div class="frame-footer onSurfaceVariant--text px-4 mb-8 d-flex flex-column">
      <span class="text-h4 mb-4">{{ track['al'] && track['al']['name'] }}</span>
      <span class="text-h4 mb-4">by - {{ track['ar'] && track['ar'][0]['name'] }}</span>
      <span class="text-h2 font-weight-bold">{{ track.name }}</span>
    </div>
    <v-progress-linear :value="playPercent" rounded />
  </v-card>
</template>

<script>
import {
  mdiArrowCollapse,
  mdiArrowExpand,
  mdiClose,
  mdiCommentQuoteOutline,
  mdiDotsHorizontal,
  mdiHeart,
  mdiPauseCircle,
  mdiPodcast,
  mdiRepeat,
  mdiShuffle,
  mdiSkipNext,
  mdiSkipPrevious,
} from '@mdi/js'
import { storeToRefs } from 'pinia'

import { usePlayerStore } from '@/store/player'

export default {
  name: 'Playing',
  setup() {
    const playerStore = usePlayerStore()
    const { currentTime, track } = storeToRefs(playerStore)
    return {
      currentTime,
      track,
    }
  },
  data: () => ({
    icon: {
      mdiHeart,
      mdiDotsHorizontal,
      mdiShuffle,
      mdiSkipPrevious,
      mdiSkipNext,
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
  computed: {
    albumPicUrl() {
      return `${this.track.al?.picUrl}?param=512y512`
    },
    playPercent() {
      const total = this.track.dt
      const current = this.currentTime * 1000
      return Math.ceil((current / total) * 100)
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
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
  padding: 0 24px;
  &-header {
    z-index: 2;
    display: flex;
    justify-content: space-between;
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
