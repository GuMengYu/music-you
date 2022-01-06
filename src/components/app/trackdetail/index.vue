<template>
  <v-dialog
    fullscreen
    v-model="showLyricsPage"
    transition="dialog-bottom-transition"
  >
    <div class="frame inverseSurface">
      <div class="frame-header">
        <v-btn icon @click="close">
          <v-icon color="inverseOnSurface">
            {{ icon.mdiClose }}
          </v-icon>
        </v-btn>
        <v-btn icon @click="toggleFullScreen"
          ><v-icon color="inverseOnSurface">{{
            fullscreen ? icon.mdiArrowCollapse : icon.mdiArrowExpand
          }}</v-icon></v-btn
        >
      </div>
      <div class="frame-content">
        <div class="left">
          <div class="d-flex flex-column inverseOnSurface--text mb-8">
            <span class="text-h3 font-weight-bold">{{ track.name }}</span>
            <span class="text-body-1">{{
              $ochain(track, 'ar', '0', 'name')
            }}</span>
          </div>
          <div class="control_process mt-2">
            <vue-slider
              ref="vueLyricSlider"
              v-model="currentTime"
              class="playing-progress"
              :max="~~(track.dt / 1000) || 0"
              :min="0"
              :interval="1"
              :duration="0"
              :drag-on-click="true"
              :dot-size="10"
              :height="2"
              tooltip="none"
              @drag-end="handleSlideChange"
            />
          </div>
        </div>
        <v-card flat rounded="xl" class="right">
          <v-img class="cover-img" :src="albumPicUrl" />
        </v-card>
        <!--        <v-col v-if="enableLyric" class="frame-content-right px-4">-->
        <!--          <v-list ref="lyricContainer" class="frame-lyrics" nav>-->
        <!--            <div class="first"></div>-->
        <!--            <v-list-item-->
        <!--              v-for="(item, index) in lyric"-->
        <!--              :key="index"-->
        <!--              :aria-time="item.time"-->
        <!--              :aria-index="index"-->
        <!--              :class="{ active: index === activeIdx }"-->
        <!--              class="py-2"-->
        <!--              v-html="item.sentence"-->
        <!--              @click="jump(item.time)"-->
        <!--            >-->
        <!--              {{ item.sentence }}-->
        <!--            </v-list-item>-->
        <!--            <div class="last mb-10"></div>-->
        <!--          </v-list>-->
        <!--        </v-col>-->
      </div>
    </div>
  </v-dialog>
</template>

<script>
import {
  mdiArrowCollapse,
  mdiArrowExpand,
  mdiClose,
  mdiCommentQuoteOutline,
  mdiDotsHorizontal,
  mdiPauseCircle,
  mdiPodcast,
  mdiRepeat,
  mdiShuffle,
  mdiSkipNext,
  mdiSkipPrevious,
} from '@mdi/js';
import { get, sync } from 'vuex-pathify';
import { formatLyric } from '@/util/fn';
import VueSlider from 'vue-slider-component';
import { findIndex } from 'lodash-es';

export default {
  name: 'DefaultTrackDetail',
  components: {
    VueSlider,
  },
  data: () => ({
    icon: {
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
    fullscreen: false,
    activeIdx: -1,
    interval: null,
    showLyric: true,
  }),
  computed: {
    isCurrentFm: get('music/isCurrentFm'),
    albumPicUrl() {
      return `${this.track.al?.picUrl}?param=512y512`;
    },
    lyric() {
      const { tlyric, lrc } = this.track.lyric ?? {};
      let lyric = lrc?.lyric ? formatLyric(lrc.lyric) : [];
      let _tlyric = tlyric?.lyric ? formatLyric(tlyric.lyric) : [];
      if (_tlyric.length) {
        return lyric.map((i) => {
          const _t = _tlyric.find((t) => t.time === i.time);
          return {
            sentence: `${i.sentence}${
              _t?.sentence ? `<br>${_t?.sentence}` : ''
            }`,
            time: i.time,
          };
        });
      } else {
        return lyric;
      }
    },
    currentTime: sync('music/currentTime'),
    track: get('music/track'),
    showLyricsPage: sync('music/showLyricsPage'),
    dynamicBg: sync('settings/dynamicBg'),
    enableLyric() {
      return this.lyric.length && this.showLyric;
    },
  },
  watch: {
    showLyricsPage(val) {
      if (val) {
        this.initInterval();
      } else {
        clearInterval(this.interval);
      }
    },
  },
  mounted() {
    this.initInterval();
    document.documentElement.onfullscreenchange = this.onfullscreenchange;
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    initInterval() {
      // if (this.enableLyric) {
      //   this.interval = setInterval(() => {
      //     this.calculate();
      //   }, 500);
      // }
    },
    // 计算歌词位置并滚动
    calculate() {
      const current = this.currentTime;
      const prevActiveIdx = this.activeIdx;
      const activeIdx = findIndex(this.lyric, (o, idx) => {
        const next = this.lyric[idx + 1];
        return (next ? current < next.time : true) && current >= o.time;
      });
      this.activeIdx = activeIdx;
      // 当前歌词渲染后计算滚动位置
      this.$nextTick(async () => {
        if (activeIdx >= 0 && prevActiveIdx !== activeIdx) {
          const container = this.$refs.lyricContainer;
          const activeEl = document.querySelector('.frame-lyrics .active');
          if (activeEl) {
            const newY = activeEl.offsetTop - activeEl.clientHeight * 2;
            const offset = await this.$vuetify.goTo(newY, {
              container,
              duration: 1000,
            });
            console.log('scroll to ' + offset);
          }
        }
      });
    },
    jump(time) {
      this.currentTime = time;
    },
    close() {
      this.showLyricsPage = false;
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.fullscreen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          this.fullscreen = false;
        }
      }
    },
    onfullscreenchange(event) {
      this.fullscreen = document.fullscreenElement === event.target;
    },
    handleSlideChange() {
      this.currentTime = this.$refs['vueLyricSlider'].getValue();
    },
  },
};
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
  .frame-header {
    position: absolute;
    left: 20px;
    right: 20px;
    top: 20px;
    -webkit-app-region: no-drag;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    //&:before {
    //  content: '';
    //  display: block;
    //  background: #fff;
    //  filter: brightness(0.7);
    //  width: 4em;
    //  height: 0.3em;
    //  margin: 1em auto;
    //  z-index: 1;
    //  border-radius: 15em;
    //  mix-blend-mode: overlay;
    //  cursor: pointer;
    //}
  }
  .frame-content {
    z-index: 1;
    display: flex;
    height: 100vh;
    align-items: center;
    justify-content: space-between;
    .left {
      padding: 0 24px;
      flex: 1;
      text-align: center;
    }
    .right {
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
