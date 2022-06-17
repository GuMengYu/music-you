<template>
  <div class="video-container">
    <custom-col :title="video.data.name">
      <div>
        <div class="video rounded-lg">
          <video ref="videoPlayer" class="plyr" />
        </div>
        <div class="d-flex mt-4">
          <div class="font-weight-bold">
            <artists-link :artists="artists" />
            ·
            <span>
              {{ $t('main.play_count', [video.data.playCount]) }}
            </span>
            ·
            <span>
              {{ video.data.publishTime }}
            </span>
          </div>
        </div>
      </div>
    </custom-col>
    <custom-col :title="$t('main.simi')">
      <v-row>
        <v-col v-for="mv in simi" :key="mv.id" cols="3">
          <video-cover :data="mv" />
        </v-col>
      </v-row>
    </custom-col>
  </div>
</template>

<script lang="ts">
import 'plyr/dist/plyr.css'

import Plyr from 'plyr'

import { getMvUrl, mvDetail, simiMv } from '@/api/mv'
export default defineComponent({
  name: 'MusicVideo',
  props: {
    id: [String, Number],
  },
  data() {
    return {
      player: null,
      video: {
        url: '',
        data: {
          name: '',
          artistName: '',
          playCount: '',
          publishTime: '',
        },
      },
      simi: [],
    }
  },
  computed: {
    liked() {
      return true
    },
    artists() {
      return [
        {
          id: this.video.data.artistId,
          name: this.video.data.artistName,
        },
      ]
    },
  },
  watch: {
    id() {
      this.fetch()
    },
  },
  mounted() {
    this.initPlayer()
    this.fetch()
  },
  methods: {
    initPlayer() {
      const videoOptions = {
        settings: ['quality'],
        autoplay: false,
        quality: {
          default: 1080,
          options: [1080, 720],
        },
      }
      this.player = new Plyr(this.$refs['videoPlayer'], videoOptions)
      this.player.volume = this.volume
      this.player.on('playing', () => {
        this.$player.pause()
      })
    },
    async fetch() {
      const _video = await mvDetail(this.id)
      this.video = _video
      const { name: title, cover } = _video.data
      const sources = await this.getAllUrl([1080, 720], this.id)
      this.player.source = {
        type: 'video',
        title,
        sources,
        poster: cover.replace(/^http:/, 'https:'),
      }
      const { mvs } = await simiMv(this.id)
      this.simi = mvs
    },
    async getAllUrl(qualities, id) {
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
    },
  },
})
</script>
<style lang="scss" scoped>
.video-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  .video {
    overflow: hidden;
    --plyr-color-main: var(--v-primary-base);
  }
}
</style>
