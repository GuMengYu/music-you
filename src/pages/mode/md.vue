<template>
  <v-card class="md-container" :theme="currentTheme">
    <dynamic-background-ios class="position-absolute" />
    <div class="md-header d-flex pt-2 px-2 justify-end drag-area">
      <v-btn class="no-drag-area" icon variant="text" @click="close">
        <v-icon>
          {{ icon.mdiClose }}
        </v-icon>
      </v-btn>
    </div>
    <v-row no-gutters class="md-content">
      <v-col cols="12" class="pa-4 d-flex align-center justify-center">
        <div class="md-left d-flex flex-column align-center">
          <v-img width="256" height="256" class="frame-cover-img rounded-md" :src="albumPicUrl" :aspect-ratio="1">
          </v-img>
          <span class="text-h3 line-clamp-1 my-4" style="word-break: break-all">
            {{ track.name }}
          </span>
          <span class="text-h5">{{ track['ar'] && track['ar'][0]['name'] }}</span>
          <div class="d-flex flex-fil justify-center mt-8">
            <Control simple />
            <music-comment-toggle :id="track.id" />
          </div>
        </div>
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
  mdiDotsHorizontal,
  mdiHeart,
  mdiPauseCircle,
  mdiPodcast,
  mdiRepeat,
  mdiShuffle,
} from '@mdi/js'
import { storeToRefs } from 'pinia'

import placeholderUrl from '@/assets/placeholder.png'
import DynamicBackgroundIos from '@/pages/mode/components/dynamicBackgroundIos.vue'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { useSettingStore } from '@/store/setting'
import { formatDuring } from '@/util/fn'
import is from '@/util/is'

export default defineComponent({
  components: { DynamicBackgroundIos },
  setup() {
    const playerStore = usePlayerStore()
    const appStore = useAppStore()
    const settingStore = useSettingStore()
    const bgColor = ref<string>('')
    const { currentTime, track } = storeToRefs(playerStore)

    const currentTheme = computed(() => {
      return settingStore.wallpaperColor + 'Dark'
    })
    const albumPicUrl = computed(() => {
      return track.value?.al?.picUrl
    })
    async function close() {
      // if (is.electron()) {
      //   const ipcRenderer = useIpcRenderer()
      //   await ipcRenderer.invoke('restoreSize')
      // }
      appStore.showLyric = false
    }
    // watchEffect(() => {
    //   if (albumPicUrl.value) {
    //     initColor(albumPicUrl.value)
    //   }
    // })
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
      is,
      currentTheme,
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
  .md-header {
    z-index: 1;
  }
  .md-content {
    z-index: 1;
    .md-left {
      color: v-bind(textColor);
    }
  }
}
</style>
