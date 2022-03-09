<template>
  <v-card color="surface" class="basic-container">
    <div class="frame">
      <div class="frame-header">
        <v-btn icon @click="close">
          <v-icon>
            {{ icon.mdiChevronDown }}
          </v-icon>
        </v-btn>
        <span class="text-caption">{{ track.name }}</span>
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
            :src="albumPicUrl"
          />
        </v-card>
        <div class="control_bar d-flex flex-column justify-space-between mb-4">
          <div class="d-flex justify-space-between">
            <div class="left d-flex flex-column text-body-1 font-weight-bold">
              <span>{{ track.name }}</span>
              <span>{{ $ochain(track, 'ar', '0', 'name') }}</span>
            </div>
            <div class="right d-flex align-center">
              <v-btn icon>
                <v-icon>
                  {{ icon.mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
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
          <control />
          <div class="d-flex justify-space-between mt-2">
            <v-btn @click="showLyric = !showLyric" icon>
              <v-icon>
                {{ icon.mdiPodcast }}
              </v-icon>
            </v-btn>
            <v-btn
              v-if="lyric.length"
              @click="showLyric = !showLyric"
              icon
              :color="showLyric ? 'accent' : void 0"
            >
              <v-icon>
                {{ icon.mdiCommentQuoteOutline }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <v-card
        v-if="enableLyric"
        class="frame-content-lyric pa-2 mx-4"
        color="surfaceVariant"
      >
        <div class="d-flex justify-space-between align-center">
          <span class="font-weight-bold text-caption">歌词</span>
          <v-btn x-small rounded
            >更多<v-icon x-small class="ml-1">{{
              icon.mdiArrowExpand
            }}</v-icon></v-btn
          >
        </div>
        <div class="before"></div>
        <ul
          ref="lyricContainer"
          class="frame-lyrics surfaceVariant text-subtitle-2 onSurfaceVariant--text"
        >
          <li
            v-for="(item, index) in lyric"
            :key="index"
            :aria-time="item.time"
            :class="{
              active: index === activeIdx,
              'font-weight-bold': index === activeIdx,
            }"
            v-html="item.sentence"
            @click="jump(item.time)"
          ></li>
        </ul>
        <div class="after"></div>
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
import { get, sync, dispatch } from 'vuex-pathify';
import { formatLyric } from '@/util/fn';
import VueSlider from 'vue-slider-component';
import { findIndex } from 'lodash-es';
import Control from '@components/app/Control';
export default {
  name: 'PlayingBasic',
  components: {
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
  },
  destroyed() {
    clearInterval(this.interval);
  },
  methods: {
    initInterval() {
      if (this.enableLyric) {
        this.interval = setInterval(() => {
          this.calculate();
        }, 500);
      }
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
              duration: 500,
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
        height: calc(100% - 36px);
        position: relative;
        z-index: 1;
        overflow-y: hidden;
        padding-left: 0;
        margin: 8px 0;
        li {
          list-style: none;
          margin-bottom: 8px;
        }
      }
      .before {
        top: 28px;
        left: 0;
        right: 0;
        position: absolute;
        background-image: linear-gradient(
          -180deg,
          var(--v-surfaceVariant-base) 22%,
          rgba(151, 101, 103, 0) 87%
        );
        height: 24px;
        z-index: 2;
      }
      .after {
        position: absolute;
        bottom: 16px;
        left: 0;
        right: 0;
        background-image: linear-gradient(
          -180deg,
          rgba(151, 101, 103, 0) 22%,
          var(--v-surfaceVariant-base) 87%
        );
        height: 36px;
        z-index: 2;
      }
    }
  }
}
</style>
