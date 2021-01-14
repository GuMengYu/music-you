<template>
  <v-sheet
    tag="header"
    class="playing-bar"
    elevation="2"
  >
    <div
      class="playing-bar__left"
    >
      <v-hover v-slot="{ hover }">
        <v-card
          class="playing-cover-card"
          :img="albumPicUrl"
          max-height="50"
          max-width="50"
          min-width="50"
          min-height="50"
        >
          <v-fade-transition>
            <v-overlay
              :value="hover"
              absolute
            >
              <v-card-actions>
                <v-btn icon @click="showMusic = !showMusic">
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
        <a>
          <span
            class="song-name h-2x"
            :title="`${song.name} - ${$$(song, 'ar', '0', 'name')}`"
          >
            {{ song.name }} - {{ $$(song, 'ar', '0', 'name') }}
          </span>
        </a>
      </div>
    </div>
    <div
      class="playing-bar__center"
    >
      <div class="playing-control">
        <div class="playing-control-buttons">
          <v-btn
            icon
            text
            color="#f9223b"
          >
            <v-icon small>
              {{ icon.mdiHeart }}
            </v-icon>
          </v-btn>
          <v-btn
            icon
            text
            color="purple"
            @click="playPrev"
          >
            <v-icon small>
              {{ icon.mdiSkipPrevious }}
            </v-icon>
          </v-btn>
          <v-btn
            icon
            text
            color="blue"
            @click="playPause"
          >
            <v-icon x-large>
              {{ playing ? icon.mdiPauseCircle : icon.mdiPlayCircle }}
            </v-icon>
          </v-btn>
          <v-btn
            icon
            text
            color="green"
            @click="playNext"
          >
            <v-icon small>
              {{ icon.mdiSkipNext }}
            </v-icon>
          </v-btn>
          <v-btn
            icon
            text
            color="blue"
            @click="playOrder"
          >
            <v-icon small>
              {{ orderIconState }}
            </v-icon>
          </v-btn>
        </div>
        <div class="playing-control-slider">
          <div class="playing-time mr-1">
            <span>{{ playTime | formatDuring }}</span>
          </div>
          <v-slider
            v-model="playTime"
            height="20"
            class="playing-progress"
            dense
            hide-details
            :max="song.dt"
            min="0"
            color="#de7a7b"
            track-fill-color="#de7a7b"
            @start="handleChangeTimeStart"
            @change="handleSlideChange"
          />
          <div class="playing-time ml-1">
            <span>{{ song.dt | formatDuring }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="playing-bar__right"
    >
      <div class="ExtraControls">
        <div class="volume-bar d-flex align-center">
          <v-btn
            icon
            text
            color="blue"
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
          color="blue"
          @click="showList = !showList"
        >
          <v-icon small>
            {{ icon.mdiPlaylistMusic }}
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-expand-transition>
      <v-sheet v-show="showMusic" class="musicStation">
        <play-content :song="song" @close="closeMusic" />
      </v-sheet>
    </v-expand-transition>
    <audio
      ref="audio"
      :src="musicUrl"
      @ended="playNext"
      @canplaythrough="onCanPlayThrough"
    >
      Your browser does not support the <code>audio</code> element.
    </audio>
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex';
import {sync} from 'vuex-pathify';
import {
  mdiHeart,
  mdiSkipPrevious,
  mdiSkipNext,
  mdiPlayCircle,
  mdiPauseCircle,
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

import Audio from './audio';
import PlayContent from '@/views/playbar/play-content';
let prevVolume = 1;
const PLAY_MODE = {
  ORDER: 0,
  CYCLE: 1,
  SINGLE_CYCLE: 2,
  RANDOM: 3,
};
export default {
  components: {PlayContent},
  data: () => ({
    icon: {
      mdiHeart,
      mdiSkipPrevious,
      mdiSkipNext,
      mdiPlayCircle,
      mdiPauseCircle,
      mdiPlaylistMusic,
      mdiArrowExpand,
    },
    player: {},
    interval: null,
    playTime: 0,
    volume: 1,
    prevVolume: 1,
    playMode: PLAY_MODE.ORDER,
    showMusic: false,
  }),
  computed: {
    ...mapState({
      song: state => state.music.song,
      musicUrl: state => state.music.musicUrl,
      playing: state => state.music.playing,
      pendingList: state => state.music.pendingList,
      currentTime: state => state.music.currentTime,
    }),
    showList: sync('music/showList'),
    songIndex() {
      return this.pendingList.findIndex(song => song.id === this.song.id);
    },
    next() {
      return this.pendingList[(this.songIndex + 1) === this.pendingList.length ? 0 : this.songIndex + 1];
    },
    prev() {
      return this.pendingList[this.songIndex  === 0 ? (this.pendingList.length - 1) : this.songIndex - 1];
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
    albumPicUrl() {
      return this.song.al ? `${this.song.al?.picUrl}?param=200y200` : '';
    },
  },
  watch: {
    playing(val) {
      this.$nextTick(() => {
        if (val) {
          this.setPlayTime();
          this.player.play();
        } else {
          clearInterval(this.interval);
          this.player.pause();
        }
      });
    },
    currentTime(val) {
      this.playTime = val;
    },
    volume(val) {
      this.player.element.volume = val;
    },
    song() {
      this.initMediaSession();
    },
  },
  mounted() {
    this.player = new Audio(this.$refs.audio);
  },
  methods: {
    playPause() {
      this.$store.commit('music/UPDATE_PLAYER', {playing: !this.playing});
    },
    playNext() {
      let id = this.next.id;
      const len = this.pendingList.length;
      if (this.playMode === PLAY_MODE.RANDOM) {
        id = this.pendingList[Math.floor(Math.random() * len)]?.id;
      } else if (this.playMode === PLAY_MODE.SINGLE_CYCLE) {
        this.rePlay();
      } else if (this.playMode === PLAY_MODE.ORDER && this.songIndex === len - 1) {
        this.$store.commit('music/UPDATE_PLAYER', {currentTime: 0, playing: false});
      } else {
        this.$store.dispatch('music/startNewMusic', id);
      }
    },
    playPrev() {
      this.$store.dispatch('music/startNewMusic', this.prev.id);
    },
    rePlay() {
      this.handleSlideChange(0);
    },
    onCanPlayThrough() {
      console.log('already can play');
      this.$store.commit('music/UPDATE_PLAYER', {playing: true});
    },
    setPlayTime() {
      this.interval = setInterval(() => {
        this.$store.commit('music/UPDATE_PLAYER', {currentTime: this.player.element.currentTime * 1000});
      }, 500);
    },
    // 停止进度条
    stopPlayTime() {
      clearInterval(this.interval);
    },
    // 拉动进度条的时候，停止时间计时
    handleChangeTimeStart() {
      console.log('slider move start');
      this.stopPlayTime();
    },
    handleSlideChange(v) {
      console.log('slider change end');
      this.player.element.currentTime = v / 1000;
      this.$store.commit('music/UPDATE_PLAYER', {currentTime: v});
      this.playing && this.setPlayTime();
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
    initMediaSession() {
      // https://developers.google.com/web/updates/2017/02/media-session
      if ('mediaSession' in navigator) {
        // eslint-disable-next-line no-undef
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.song.name,
          artist: this.song.ar?.[0]?.name,
          album: this.song.al?.name,
          artwork: [
            { src: this.albumPicUrl, sizes: '512x512', type: 'image/png' },
          ],
        });
        [
          ['play', this.playPause],
          ['pause', this.playPause],
          ['previoustrack', this.playPrev],
          ['nexttrack', this.playNext],
        ].map(([name, fn]) => navigator.mediaSession.setActionHandler(name, fn));
      }
    },
    closeMusic() {
      this.showMusic = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../scss/common';
.playing-bar {
  display: flex;
  justify-content: space-between;
  background: #E0DFDE;
  padding: 5px 5px 0;
  -webkit-app-region: drag;
  .playing-bar__left {
    min-width: 200px;
    max-width: 220px;
    overflow: hidden;
    display: flex;
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
      color: #6a737d;
    }
  }
  .playing-bar__center {
    .playing-control {
      min-width: 280px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .playing-control-buttons {
        display: flex;
        width: 200px;
        justify-content: space-around;
      }
      .playing-control-slider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 90%;
        .playing-time {
          font-size: 14px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          -webkit-font-smoothing: antialiased;
        }
      }
      .playing-progress {
        -webkit-app-region: no-drag
      }
    }
  }
  .playing-bar__right {
    display: flex;
    align-items: center;
    .ExtraControls {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .volume-bar {
        width: 130px;
      }
    }
    .playing-volume {
      -webkit-app-region: no-drag
    }
  }
  .musicStation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 999;
  }
}
</style>
