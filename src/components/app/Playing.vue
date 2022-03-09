<template>
  <v-dialog
    fullscreen
    v-model="showLyricsPage"
    transition="dialog-bottom-transition"
  >
    <v-card class="frame" color="surfaceVariant">
      <div
        class="frame-header d-flex justify-space-between mt-6 drag-area px-4"
      >
        <span
          class="frame-header-title font-weight-bold text-lg-h2 text-md-h3 text-xl-h1 text-sm-h4 onSurfaceVariant--text"
        >
          {{ track.dt | formatDuring }} /
          {{ (currentTime * 1000) | formatDuring }}
        </span>
        <div class="frame-header-action d-flex no-drag-area flex-column">
          <v-btn icon @click="close" color="onPrimary">
            <v-icon>
              {{ icon.mdiClose }}
            </v-icon>
          </v-btn>
          <like-toggle :id="track.id" />
          <v-btn icon @click="openMenu">
            <v-icon color="onPrimary">
              {{ icon.mdiDotsHorizontal }}
            </v-icon>
          </v-btn>
        </div>
      </div>
      <div class="frame-content onSurfaceVariant--text">
        <v-img
          max-height="200"
          max-width="200"
          class="frame-cover-img rounded"
          :src="albumPicUrl"
        />
      </div>
      <div
        class="frame-footer onSurfaceVariant--text px-4 mb-8 d-flex flex-column"
      >
        <span class="text-h4 mb-4">{{
          track['al'] && track['al']['name']
        }}</span>
        <span class="text-h4 mb-4"
          >by - {{ track['ar'] && track['ar'][0]['name'] }}</span
        >
        <span class="text-h2 font-weight-bold">{{ track.name }}</span>
      </div>
      <v-progress-linear :value="playPercent" rounded />
      <!-- <div
        class="frame-play-progress"
        :style="{ transform: `translateX(-${playPercent}vw)` }"
      ></div> -->
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mdiHeart,
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
import { dispatch, get, sync } from 'vuex-pathify';
import { formatLyric } from '@util/fn';
import { findIndex } from 'lodash-es';
import LikeToggle from '@components/app/likeToggle.vue';

export default {
  name: 'Playing',
  components: { LikeToggle },
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
    track: get('music/track') ?? {},
    showLyricsPage: sync('music/showLyricsPage'),
    dynamicBg: sync('settings/dynamicBg'),
    enableLyric() {
      return this.lyric.length && this.showLyric;
    },
    liked() {
      return this.$store.getters['music/liked'](this.track.id);
    },
    playPercent() {
      if (this.showLyricsPage) {
        const total = this.track.dt;
        const current = this.currentTime * 1000;
        return Math.ceil((current / total) * 100);
      } else {
        return 0;
      }
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
    openMenu(e) {
      const { clientX: x, clientY: y } = e;
      const items = [{ title: '收藏到歌单', action: 'add' }];
      dispatch('contextmenu/show', { x, y, items });
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
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
