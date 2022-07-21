<template>
  <v-card :image="albumPicUrl" class="md-container">
    <v-row no-gutters class="md-content">
      <v-col cols="6" class="pa-4 d-flex align-center justify-center">
        <v-btn icon variant="plain" position="absolute" location="top start" @click="close">
          <v-icon>
            {{ icon.mdiClose }}
          </v-icon>
        </v-btn>
        <div class="md-left d-flex flex-column align-center">
          <span class="text-h2 line-clamp-1 mb-2" style="word-break: break-all">
            {{ track!.name }}
          </span>
          <span class="text-h5">{{ track!['ar'] && track!['ar'][0]['name'] }}</span>
          <lyric class="text-h5 mt-4" />
        </div>
      </v-col>
      <v-col cols="6" class="pa-xl-16 pa-lg-12 pa-md-8 d-flex align-center">
        <v-hover v-slot="{ isHovering, props: hoverProps }">
          <v-img
            v-bind="hoverProps"
            class="frame-cover-img rounded-xl"
            :src="albumPicUrl"
            :lazy-src="placeholderUrl"
            :aspect-ratio="1"
            :gradient="`90deg, rgb(0 0 0 / 50%) 0%, rgb(0 0 0 / 0%) 50%, rgb(0 0 0 / 50%) 100%`"
          >
            <div class="d-flex flex-fill fill-height align-end justify-center pa-4">
              <transition name="slide-fade-y">
                <div v-if="isHovering" class="d-flex flex-fil justify-center">
                  <Control />
                </div>
              </transition>
            </div>
          </v-img>
        </v-hover>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { hexFromArgb, sourceColorFromImage } from '@material/material-color-utilities'
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
import Lyric from '@/pages/mode/lyric.vue'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { formatDuring } from '@/util/fn'
import is from '@/util/is'

export default defineComponent({
  components: { Lyric },
  setup() {
    const playerStore = usePlayerStore()
    const appStore = useAppStore()
    const bgColor = ref<string>('')
    const { currentTime, track } = storeToRefs(playerStore)

    const albumPicUrl = computed(() => {
      return track.value?.al?.picUrl
    })
    async function close() {
      if (is.electron()) {
        const ipcRenderer = useIpcRenderer()
        await ipcRenderer.invoke('restoreSize')
      }
      appStore.showLyric = false
    }
    watchEffect(() => {
      if (albumPicUrl.value) {
        initColor(albumPicUrl.value)
      }
    })
    async function initColor(url: string) {
      if (!albumPicUrl.value) {
        return
      }
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = url
      const color = await sourceColorFromImage(image)
      bgColor.value = hexFromArgb(color)
    }
    const textColor = computed(() => {
      return '#fff'
    })
    return {
      currentTime,
      track,
      formatDuring,
      close,
      albumPicUrl,
      placeholderUrl,
      textColor,
      bgColor,
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
.md-container {
  :deep(.v-card__image) {
    filter: blur(140px) brightness(80%);
  }
  .md-content {
    z-index: 1;
    .md-left {
      color: v-bind(textColor);
    }
  }
}
</style>
