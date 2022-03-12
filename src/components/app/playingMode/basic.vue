<template>
  <v-card :color="theme.background" class="basic-container">
    <div class="frame">
      <div class="frame-header">
        <v-btn icon @click="close">
          <v-icon>
            {{ icon.mdiChevronDown }}
          </v-icon>
        </v-btn>
        <span class="text-caption">{{ album.name }}</span>
        <v-btn icon @click="openMenu">
          <v-icon>
            {{ icon.mdiDotsHorizontal }}
          </v-icon>
        </v-btn>
      </div>
      <div class="frame-content-info">
        <v-card class="rounded-lg album-cover my-4">
          <v-img
            class="cover-img"
            max-height="calc(100vh - 315px)"
            max-width="calc(100vh - 315px)"
            :src="album.picUrl"
          />
        </v-card>
        <div class="control_bar d-flex flex-column justify-space-between mb-4">
          <div class="d-flex justify-space-between">
            <div class="left d-flex flex-column">
              <span class="text-body-1 font-weight-bold">{{ track.name }}</span>
              <artists-link :artists="track.ar" />
            </div>
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
            <div class="time-info d-flex justify-space-between text-caption">
              <span>{{ (currentTime * 1000) | formatDuring }}</span>
              <span>{{ track.dt | formatDuring }}</span>
            </div>
          </div>
          <control class="justify-space-between" />
          <div class="d-flex justify-space-between mt-2">
            <v-btn @click="showLyric = !showLyric" icon>
              <v-icon small>
                {{ icon.mdiPodcast }}
              </v-icon>
            </v-btn>
            <v-btn
              v-if="lyric.length"
              @click="showLyric = !showLyric"
              icon
              :color="showLyric ? theme.primary : void 0"
            >
              <v-icon small>
                {{ icon.mdiCommentQuoteOutline }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-card
        v-if="enableLyric"
        class="frame-content-lyric pa-4"
        :color="theme.surfaceVariant"
      >
        <div class="d-flex justify-space-between align-center">
          <span class="font-weight-bold text-subtitle-2">{{
            $t('common.lyric')
          }}</span>
          <!--          <v-btn-->
          <!--            x-small-->
          <!--            rounded-->
          <!--            class="text-caption"-->
          <!--            :color="theme.onSurfaceVariant"-->
          <!--            outlined-->
          <!--            >更多<v-icon x-small class="ml-1">{{-->
          <!--              icon.mdiArrowExpand-->
          <!--            }}</v-icon></v-btn-->
          <!--          >-->
        </div>
        <div class="before" :style="beforeMaskImages"></div>
        <ul
          ref="lyricContainer"
          class="frame-lyrics my-4 text-xl-h6 text-lg-subtitle-1 font-weight-bold"
        >
          <li>&nbsp;</li>
          <li
            v-for="(item, index) in lyric"
            :key="index"
            :aria-time="item.time"
            class="mb-2"
            :class="{
              active: index === activeIdx,
            }"
            :style="{ color: index === activeIdx ? theme.primary : '' }"
            v-html="item.sentence"
            @click="jump(item.time)"
          ></li>
          <li>&nbsp;</li>
        </ul>
        <div class="after" :style="afterMaskImages"></div>
      </v-card>
    </div>
  </v-card>
</template>

<script>
import {
  mdiSkipPrevious,
  mdiDotsHorizontal,
  mdiPauseCircle,
  mdiSkipNext,
  mdiShuffle,
  mdiRepeat,
  mdiPodcast,
  mdiCommentQuoteOutline,
  mdiChevronDown,
  mdiArrowExpand,
} from '@mdi/js';
import { generatePaletteFromURL } from 'md3-theme-generator';
import { get, sync, dispatch } from 'vuex-pathify';
import { formatLyric } from '@/util/fn';
import VueSlider from 'vue-slider-component';
import { findIndex } from 'lodash-es';
import Control from '@components/app/Control';
import ArtistsLink from '@components/app/ArtistsLink';
export default {
  name: 'PlayingBasic',
  components: {
    ArtistsLink,
    Control,
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
      mdiChevronDown,
      mdiArrowExpand,
    },
    activeIdx: -1,
    interval: null,
    showLyric: true,
    autoScroll: true,
    autoScrollLocation: 0,
    palette: {
      light: {},
      dark: {},
    },
  }),
  computed: {
    isCurrentFm: get('music/isCurrentFm'),
    albumPicUrl() {
      return `${this.track.al?.picUrl}?param=512y512`;
    },
    album() {
      return this.track.al ?? {};
    },
    lyric() {
      const { tlyric, lrc } = this.track.lyric ?? {};
      let lyric = lrc?.lyric ? formatLyric(lrc.lyric) : [];
      let _tlyric = tlyric?.lyric ? formatLyric(tlyric.lyric) : [];
      if (_tlyric.length) {
        return lyric.map((i) => {
          return {
            sentence: `${i.sentence}`,
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
    theme() {
      return this.$vuetify.theme.dark ? this.palette.dark : this.palette.light;
    },
    beforeMaskImages() {
      return {
        'background-image': `linear-gradient(-180deg, ${this.theme.surfaceVariant} 60%, transparent 100%)`,
      };
    },
    afterMaskImages() {
      return {
        'background-image': `linear-gradient(0deg, ${this.theme.surfaceVariant} 60%, transparent 100%)`,
      };
    },
  },
  watch: {
    showLyricsPage(val) {
      if (val) {
        this.init();
      } else {
        clearInterval(this.interval);
      }
    },
    'track.id'() {
      this.initColor();
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    init() {
      this.initInterval();
      this.initColor();
    },
    async initColor() {
      if (!this.albumPicUrl) {
        return;
      }
      const palette = await generatePaletteFromURL(this.albumPicUrl);
      this.palette.light = palette.light;
      this.palette.dark = palette.dark;
    },
    initInterval() {
      if (this.enableLyric) {
        this.interval = setInterval(() => {
          this.calculate();
        }, 500);
      }
    },
    // 计算歌词位置并滚动
    async calculate() {
      const current = this.currentTime;
      const prevActiveIdx = this.activeIdx;
      const activeIdx = findIndex(this.lyric, (o, idx) => {
        const next = this.lyric[idx + 1];
        return (next ? current < next.time : true) && current >= o.time;
      });
      this.activeIdx = activeIdx;
      // 当前歌词渲染后计算滚动位置
      await this.$nextTick();
      if (activeIdx >= 0 && prevActiveIdx !== activeIdx) {
        const container = this.$refs.lyricContainer;
        const activeEl = container.querySelector('.frame-lyrics .active');
        if (activeEl) {
          const offset = await this.$vuetify.goTo(activeEl, {
            container,
          });
          console.debug('lyric scroll to ' + offset);
          // this.startScroll(activeEl, container);
        }
      }
    },
    startScroll(el, container) {
      if (this.autoScroll) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        console.debug('自动滚动高度：', container.scrollTop);
        this.autoScrollLocation = container.scrollTop; // 缓存滚动后的位置
      }
    },
    jump(time) {
      this.currentTime = time;
    },
    close() {
      this.$emit('close');
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
.basic-container {
  width: 100%;
  .frame {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 20px 25% 20px 25%;
    position: relative;
    .frame-header {
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .frame-content-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
      .control_bar {
        width: 100%;
      }
      .frame-content {
        flex: 1;
        .left-container {
          max-width: 30vw;
          //.album-cover {
          //  box-shadow: 4px 9px 20px #403e3e, -7px -6px 20px #565454;
          //}
        }
      }
    }
    .frame-content-lyric {
      height: 50vh;
      .frame-lyrics {
        height: calc(100% - 40px);
        position: relative;
        z-index: 1;
        overflow-y: hidden;
        padding-left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        li {
          text-align: center;
          list-style: none;
        }
      }
      .before {
        top: 38px;
        left: 0;
        right: 0;
        position: absolute;
        height: 30px;
        z-index: 2;
      }
      .after {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        height: 36px;
        z-index: 2;
      }
    }
  }
}
</style>
