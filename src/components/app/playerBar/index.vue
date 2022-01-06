<template>
  <v-expand-transition>
    <v-footer
      v-if="track.id"
      padless
      class="playing-bar"
      rounded="xl"
      app
      :style="{ bottom: '5px', left: '5px', right: '5px' }"
    >
      <div class="playing-slider">
        <vue-slider
          ref="vueSlider"
          :value="currentTime"
          class="playing-progress"
          :max="~~(track.dt / 1000) || 0"
          :min="0"
          :interval="1"
          :duration="0"
          :drag-on-click="true"
          :dot-size="10"
          :height="3"
          :tooltip-formatter="formatTime"
          @drag-end="handleSlideChange"
        />
      </div>
      <div class="playing-control">
        <div class="playing-bar__left">
          <v-hover v-slot="{ hover }">
            <v-card
              flat
              class="playing-cover-card d-flex justify-center align-center"
              :img="albumPicUrl | sizeOfImage(128)"
              max-height="40"
              max-width="40"
              min-width="40"
              min-height="40"
              :loading="loadingTrack"
            >
              <template slot="progress">
                <v-progress-circular
                  color="primary"
                  indeterminate
                  size="30"
                  width="2"
                />
              </template>
              <v-fade-transition>
                <v-overlay :value="hover" absolute>
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
          <div class="song-info mx-2">
            <router-link to="">
              <span class="song-name text--primary h-1x text-subtitle-2">
                {{ track.name }}
              </span>
            </router-link>
            <span class="text--disabled mx-2">-</span>
            <router-link :to="`/artist/${$ochain(track, 'ar', '0', 'id')}`">
              <span class="artist-name h-1x text-caption font-weight-bold">
                {{ $ochain(track, 'ar', '0', 'name') }}
              </span>
            </router-link>
          </div>
          <v-spacer />
          <v-btn icon text @click="likeSong">
            <v-icon
              small
              v-text="icon.mdiHeart"
              :color="
                liked ? 'var(--v-primary-base)' : 'var(--v-secondary-darken2)'
              "
            />
          </v-btn>
        </div>
        <div class="playing-bar__center">
          <control />
        </div>
        <div class="playing-bar__right">
          <div class="volume-bar d-flex align-center">
            <v-btn icon @click="toggleVolume">
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
            :disabled="isCurrentFm"
            @click="showList = !showList"
          >
            <v-icon small>
              {{ icon.mdiPlaylistMusic }}
            </v-icon>
          </v-btn>
        </div>
      </div>
      <play-list />
    </v-footer>
  </v-expand-transition>
</template>

<script>
import { sync, get, dispatch } from 'vuex-pathify';
import {
  mdiHeart,
  mdiHeartOutline,
  mdiSkipPrevious,
  mdiSkipNext,
  mdiPlay,
  mdiPause,
  mdiPlaylistMusic,
  mdiVolumeMute,
  mdiVolumeMedium,
  mdiVolumeLow,
  mdiVolumeHigh,
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiArrowExpand,
} from '@mdi/js';

// import Player from './player.js';
import VueSlider from 'vue-slider-component';
import { formatDuring } from '@util/fn';
import Control from '@components/app/Control';
import PlayList from '@components/app/PlayingList';

let prevVolume = 1;
const PLAY_MODE = {
  ORDER: 0,
  CYCLE: 1,
  SINGLE_CYCLE: 2,
  RANDOM: 3,
};
export default {
  name: 'PlayerBar',
  components: {
    Control,
    VueSlider,
    PlayList,
  },
  // mixins: [Player],
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
  }),
  computed: {
    isCurrentFm: get('music/isCurrentFm'),
    volume: sync('settings/volume'),
    currentTime: get('music/currentTime'),
    track: get('music/track'),
    playing: get('music/playing'),
    loadingTrack: get('music/loadingTrack'),
    showList: sync('music/showList'),
    showLyricsPage: sync('music/showLyricsPage'),
    mode: sync('music/mode'),
    liked() {
      return this.$store.getters['music/liked'](this.track.id);
    },
    volumeIconState() {
      if (this.volume === 0) {
        return mdiVolumeMute;
      } else if (this.volume > 0 && this.volume <= 0.3) {
        return mdiVolumeLow;
      } else if (this.volume > 0.3 && this.volume <= 0.6) {
        return mdiVolumeMedium;
      } else {
        return mdiVolumeHigh;
      }
    },
    orderIconState() {
      return {
        [PLAY_MODE.ORDER]: mdiRepeatOff,
        [PLAY_MODE.CYCLE]: mdiRepeat,
        [PLAY_MODE.SINGLE_CYCLE]: mdiRepeatOnce,
      }[this.mode];
    },
    playingState() {
      return this.playing
        ? { color: 'var(--v-accent-base)', icon: 'pause' }
        : { color: 'var(--v-primary-base)', icon: 'play' };
    },
    albumPicUrl() {
      return this.track?.al?.picUrl ?? '';
    },
  },
  mounted() {},
  methods: {
    handleSlideChange() {
      const currentTime = this.$refs['vueSlider'].getValue();
      console.debug('slider change end', currentTime);
      this.$player.setSeek(currentTime);
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
      this.mode < 2 ? this.mode++ : (this.mode = 0);
    },
    formatTime(val) {
      return formatDuring(val * 1000);
    },
    likeSong() {
      dispatch('music/favSong', { id: this.track.id, like: !this.liked });
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'src/scss/common';
.theme--light .playing-bar {
  background-color: var(--v-surfaceVariant-base);
}
.theme--dark .playing-bar {
  background-color: rgba(0, 0, 0, 1);
}
.playing-bar {
  z-index: 10;
  .playing-control {
    width: 100%;
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
        a {
          text-decoration: none;
          display: flex;
          align-items: center;
        }
        .song-name {
          max-width: 13vw;
        }
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
        -webkit-app-region: no-drag;
      }
    }
  }
  .playing-slider {
    position: absolute;
    -webkit-app-region: no-drag;
    top: -5px;
    left: 20px;
    right: 20px;
  }
}
</style>
