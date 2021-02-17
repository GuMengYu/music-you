<template>
  <v-sheet
    tag="footer"
    class="playing-bar"
    elevation="1"
  >
    <div class="playing-slider">
      <v-slider
        v-model="currentTime"
        class="playing-progress"
        dense
        hide-details
        :max="track.dt / 1000"
        min="0"
        track-color="rgb(128, 128, 128, .2)"
        @start="handleChangeTimeStart"
        @change="handleSlideChange"
      >
        <template v-slot:thumb-label="{ value }">
          {{ value * 1000 | formatDuring }}
        </template>
      </v-slider>
    </div>
    <div class="playing-control">
      <div
        class="playing-bar__left"
      >
        <v-hover v-slot="{ hover }">
          <v-card
            class="playing-cover-card"
            :img="albumPicUrl"
            max-height="46"
            max-width="46"
            min-width="46"
            min-height="46"
          >
            <v-fade-transition>
              <v-overlay
                :value="hover"
                absolute
              >
                <v-card-actions>
                  <v-btn icon @click="showLyricsPage = !showLyricsPage">
                    <v-icon color="pink">
                      {{ icon.mdiArrowExpand }}
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </v-hover>
        <div class="song-info">
          <router-link to="" class="text-decoration-none">
            <span
              class="song-name text--primary text-body-2 h-1x"
            >
              {{ track.name }}
            </span>
          </router-link>
          <router-link to="" class="text-decoration-none">
            <span
              class="artist-name h-2x text--primary text-caption"
            >
              {{ $$(track, 'ar', '0', 'name') }}
            </span>
          </router-link>
        </div>
        <v-btn
          icon
          text
          color="#f9223b"
          class="ml-8"
        >
          <v-icon small>
            {{ icon.mdiHeartOutline }}
          </v-icon>
        </v-btn>
      </div>
      <div
        class="playing-bar__center"
      >
        <div class="playing-control-buttons">
          <v-btn
            icon
            @click="playPrev"
          >
            <v-icon>
              {{ icon.mdiSkipPrevious }}
            </v-icon>
          </v-btn>
          <v-fab-transition>
            <v-btn
              :key="playingState.icon"
              :color="playingState.color"
              small
              fab
              elevation="0"
              @click="playPause"
            >
              <v-icon>
                {{ playing ? icon.mdiPause : icon.mdiPlay }}
              </v-icon>
            </v-btn>
          </v-fab-transition>
          <v-btn
            icon
            @click="playNext"
          >
            <v-icon>
              {{ icon.mdiSkipNext }}
            </v-icon>
          </v-btn>
        </div>
        <span class="time-info text-caption">
          {{ currentTime * 1000 | formatDuring }} / {{ track.dt | formatDuring }}
        </span>
      </div>
      <div
        class="playing-bar__right"
      >
        <v-btn
          icon
          @click="playOrder"
        >
          <v-icon small>
            {{ orderIconState }}
          </v-icon>
        </v-btn>
        <div class="volume-bar d-flex align-center">
          <v-btn
            icon
            @click="toggleVolume"
          >
            <v-icon small>
              {{ volumeIconState }}
            </v-icon>
          </v-btn>
          <v-slider
            v-model="volume"
            class="playing-volume"
            dense
            hide-details
            :max="1"
            min="0"
            step="0.01"
          />
        </div>
        <v-btn
          icon
          text
          @click="showList = !showList"
        >
          <v-icon small>
            {{ icon.mdiPlaylistMusic }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-sheet>
</template>

<script>
import {sync, get} from 'vuex-pathify';
import {
  mdiHeart,
  mdiHeartOutline,
  mdiSkipPrevious,
  mdiSkipNext,
  mdiPlay,
  mdiPause,
  mdiRepeat,
  mdiVolumeHigh,
  mdiPlaylistMusic,
  mdiVolumeMute,
  mdiVolumeMedium,
  mdiVolumeLow,
  mdiReorderHorizontal,
  mdiRepeatOnce,
  mdiMusicNoteOffOutline,
  mdiArrowExpand,
} from '@mdi/js';

import Player from './player';
let prevVolume = 1;
const PLAY_MODE = {
  ORDER: 0,
  CYCLE: 1,
  SINGLE_CYCLE: 2,
  RANDOM: 3,
};
export default {
  extends: Player,
  data: () => ({
    icon: {
      mdiHeart,
      mdiHeartOutline,
      mdiSkipPrevious,
      mdiSkipNext,
      mdiPlay,
      mdiPause,
      mdiPlaylistMusic,
      mdiArrowExpand,
    },
    prevVolume: 1,
    playMode: PLAY_MODE.ORDER,
  }),
  computed: {
    track: get('music/track'),
    playingList: get('music/playingList'),
    playing: get('music/playing'),
    showList: sync('music/showList'),
    showLyricsPage: sync('music/showLyricsPage'),
    songIndex() {
      return this.playingList.findIndex(track => track.id === this.track.id);
    },
    next() {
      return this.playingList[(this.songIndex + 1) === this.playingList.length ? 0 : this.songIndex + 1];
    },
    prev() {
      return this.playingList[this.songIndex  === 0 ? (this.playingList.length - 1) : this.songIndex - 1];
    },
    volumeIconState() {
      if (this.volume === 0) {
        return mdiVolumeMute;
      } else if (this.volume > 0 && this.volume <= 0.4) {
        return mdiVolumeLow;
      } else if (this.volume > 0.4 && this.volume <= 0.7) {
        return mdiVolumeMedium;
      } else {
        return mdiVolumeHigh;
      }
    },
    orderIconState() {
      return ({
        [PLAY_MODE.ORDER] : mdiReorderHorizontal,
        [PLAY_MODE.CYCLE] : mdiRepeat,
        [PLAY_MODE.SINGLE_CYCLE] : mdiRepeatOnce,
        [PLAY_MODE.RANDOM] : mdiMusicNoteOffOutline,
      })[this.playMode];
    },
    playingState () {
      return this.playing ? { color: 'accent', icon: mdiPause } : { color: 'primary', icon: mdiPlay };
    },
    albumPicUrl() {
      return this.track.al ? `${this.track.al?.picUrl}?param=200y200` : '';
    },
  },
  watch: {
    playing(val) {
      this.$nextTick(() => {
        if (val) {
          this.play();
        } else {
          this.pause();
        }
      });
    },
  },
  mounted() {},
  methods: {
    playPause() {
      this.$store.commit('music/UPDATE_PLAYER', {playing: !this.playing});
    },
    playNext() {
      let id = this.next.id;
      const len = this.playingList.length;
      if (this.playMode === PLAY_MODE.RANDOM) {
        id = this.playingList[Math.floor(Math.random() * len)]?.id;
      } else if (this.playMode === PLAY_MODE.SINGLE_CYCLE) {
        this.rePlay();
      } else if (this.playMode === PLAY_MODE.ORDER && this.songIndex === len - 1) {
        this.$store.commit('music/UPDATE_PLAYER', {currentTime: 0, playing: false});
      } else {
        this.$store.dispatch('music/updateTrack', id);
      }
    },
    playPrev() {
      this.$store.dispatch('music/updateTrack', this.prev.id);
    },
    rePlay() {
      this.handleSlideChange(0);
    },
    // 拉动进度条的时候，停止计时
    handleChangeTimeStart() {
      this.stopTimer()
      console.debug('slider move start');
    },
    handleSlideChange() {
      console.debug('slider change end');
      this.restoreTimer();
      this.setSeek(this.currentTime);
    },
    toggleVolume() {
      if (this.volume === 0) {
        this.volume = prevVolume;
      } else {
        prevVolume = this.volume;
        this.volume = 0;
      }
    },
    playOrder() {
      this.playMode < 3 ? this.playMode++ : (this.playMode = 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/common';
.theme--light .playing-bar {
  background-color: rgba(255, 255, 255, .7);
}
.theme--dark .playing-bar {
  background-color: rgba(0, 0, 0, .7);
}
.playing-bar {
  backdrop-filter: blur(50px);
  z-index: 999;
  -webkit-app-region: drag;
  .playing-control {
    display: flex;
    padding: 10px;
    .playing-bar__left {
      overflow: hidden;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-start;
      .song-info {
        display: flex;
        flex-flow: column;
        margin-left: 10px;
      }
      .song-name {
        display: inline-block;
        max-width: 180px;
        text-align: center;
        font-size: 14px;
        font-weight: 700;
      }
      .artist-name {
        font-size: 14px;
        font-weight: 700;
      }
    }
    .playing-bar__center {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .playing-control-buttons {
        display: flex;
        justify-content: space-around;
        align-items: center;
        > .v-btn {
          margin: 0 8px;
        }
      }
    }
    .playing-bar__right {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;
      .volume-bar {
        width: 100%;
        max-width: 140px;
      }

      .playing-volume {
        -webkit-app-region: no-drag
      }
    }
  }
  .playing-slider {
    position: absolute;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 14px;
    top: -7px;
    .playing-progress {
      -webkit-app-region: no-drag;
      ::v-deep .v-slider__thumb-container {
        visibility: hidden;
      }
      ::v-deep .v-slider--horizontal {
        min-height: 14px;
        margin: 0;
        &:hover .v-slider__thumb-container,
        &:active .v-slider__thumb-container {
          visibility: visible;
        }
      }
      ::v-deep .v-slider__thumb {
        transition: none;
      }
    }
  }
}
</style>
