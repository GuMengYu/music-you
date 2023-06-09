<template>
  <v-row class="video-container">
    <v-col cols="9">
      <div>
        <back-btn size="small" class="mb-1" variant="tonal" color="primary" />
        <div class="video rounded-md">
          <video ref="videoPlayer" class="plyr" />
        </div>
        <v-card rounded="md" color="surfaceVariant" class="pa-4 mt-4" flat>
          <span class="text-h5">
            {{ video?.name }}
          </span>
          <div class="font-weight-bold my-2">
            <span>
              {{ $t('main.play_count', [formatNumber(video?.playCount ?? 0)]) }}
            </span>
            ·
            <span>
              {{ video?.publishTime }}
            </span>
          </div>
          <div class="d-flex align-center my-2">
            <v-avatar v-if="video?.artists?.[0].img1v1Url" size="24" class="mr-2">
              <v-img :src="sizeOfImage(video?.artists[0].img1v1Url, 128)" />
            </v-avatar>
            <artists-link :artists="video?.artists" />
          </div>
          <span class="text-caption">
            {{ video?.briefDesc }}
          </span>
        </v-card>
        <Comment v-if="showComment" :id="video?.id" type="mv" class="mx-3" />
      </div>
    </v-col>
    <v-col cols="3">
      <Col :title="$t('main.simi')">
        <video-cover v-for="mv in simis" :key="mv.id" :data="mv" class="mb-4" />
      </Col>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import 'plyr/dist/plyr.css'

import { storeToRefs } from 'pinia'
import Plyr from 'plyr'

import { getMvUrl, mvDetail, simiMv } from '@/api/mv'
import { useSettingStore } from '@/store/setting'
import type { MV } from '@/types'
import { formatNumber, sizeOfImage } from '@/util/fn'

import Comment from '../components/comment/Comment.vue'
const settingStore = useSettingStore()
const { comment: showComment } = storeToRefs(settingStore)
const props = defineProps<{
  id: string
}>()
const videoPlayer = ref<HTMLElement>()
const playerInstance = ref<Plyr>()
const video = ref<MV>()
const simis = ref<MV[]>([])
useScrollToTop(0, () => props.id)
onMounted(() => {
  initPlayer()
  fetch()
})
async function fetch() {
  const { data } = await mvDetail(+props.id)
  video.value = data
  const { name: title, cover } = data
  const sources = await getAllUrl([1080, 720], +props.id)
  playerInstance.value!.source = {
    type: 'video',
    title,
    sources,
    poster: cover!.replace(/^http:/, 'https:'),
  }
  const { mvs } = await simiMv(+props.id)
  simis.value = mvs
}

async function getAllUrl(qualities: number[], id: number) {
  const fns = qualities.map((quality) => {
    return getMvUrl({ id, r: quality })
  })
  const urls = await Promise.all(fns)
  return urls.map((result) => {
    return {
      src: result.data.url.replace(/^http:/, 'https:'),
      type: 'video/mp4',
      size: result.data.r,
    }
  })
}
function initPlayer() {
  playerInstance.value = new Plyr(videoPlayer.value!, {
    settings: ['quality'],
    autoplay: false,
    quality: {
      default: 1080,
      options: [1080, 720],
    },
  })
  // playerInstance.volume = this.volume
  // playerInstance.on('playing', () => {
  //   this.$player.pause()
  // })
}
watch(
  () => {
    return props.id
  },
  () => {
    if (props.id) {
      fetch()
    }
  }
)
</script>
<style lang="scss" scoped>
.video-container {
  .video {
    overflow: hidden;
    --plyr-color-main: rgba(var(--v-theme-primary));
  }
}
</style>
