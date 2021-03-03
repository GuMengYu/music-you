<template>
  <v-sheet>
    <custom-col
      :title="video.data.name"
    >
      <template slot="content">
        <div>
          <div class="video rounded-lg">
            <video
              ref="videoPlayer"
              class="plyr"
            />
          </div>
          <div class="d-flex mt-4">
            <div class="font-weight-bold">
              <router-link :to="'/artist/' + video.data.artistId">
                {{ video.data.artistName }}
              </router-link>
              ·
              {{ video.data.playCount }} Views ·
              {{ video.data.publishTime }}
            </div>
            <div :style="`${liked ? 'color: var(--v-primary-base)' : ''}`">
              <font-awesome-icon icon="heart" />
            </div>
          </div>
        </div>
      </template>
    </custom-col>
    <custom-col
      :title="$t('main.simi')"
    >
      <template slot="content">
        <v-row>
          <v-col
            v-for="mv in simi"
            :key="mv.id"
            cols="3"
          >
            <video-cover :data="mv" />
          </v-col>
        </v-row>
      </template>
    </custom-col>
  </v-sheet>
</template>

<script>
import { mvDetail, mvUrl, simiMv } from '@/api';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import {sync} from 'vuex-pathify';
import CustomCol from '@components/layout/Col'
import VideoCover from '@components/app/VideoCover'
export default {
  name: 'MusicVideo',
  components: {
    CustomCol,
    VideoCover,
  },
  props: {
    id: String,
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
    };
  },
  computed: {
    volume: sync('settings/volume'),
    liked() {
      return true;
    },
  },
  watch: {
    id() {
      this.fetch();
    },
  },
  mounted() {
    this.initPlayer();
    this.fetch();
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
      };
      this.player = new Plyr(this.$refs['videoPlayer'], videoOptions);
      this.player.volume = this.volume;
      this.player.on('playing', () => {
        // 暂停音乐播放
      });
    },
    async fetch() {
      const _video = await mvDetail(this.id);
      this.video = _video;
      const {name: title, cover} = _video.data;
      const sources = await this.getAllUrl([1080, 720], this.id);
      this.player.source = {
        type: 'video',
        title,
        sources,
        poster: cover.replace(/^http:/, 'https:'),
      }
      const { mvs } = await simiMv(this.id);
      this.simi = mvs;
    },
    async getAllUrl(qualities, id) {
      const fns = qualities.map(quality => {
        return mvUrl({id, r: quality})
      })
      const urls = await Promise.all(fns);
      return urls.map((result) => {
        return {
          src: result.data.url.replace(/^http:/, 'https:'),
          type: 'video/mp4',
          size: result.data.r,
        };
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.video {
  overflow: hidden;
  max-height: 68vh;
  --plyr-color-main: var(--v-primary-base);
}

</style>
