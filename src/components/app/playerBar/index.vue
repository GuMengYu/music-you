<template>
  <v-expand-transition>
    <v-footer
      v-if="track.id"
      padless
      class="playing-bar surfaceVariant"
      rounded="xl"
      app
    >
      <div class="playing-slider">
        <vue-slider
          ref="vueSlider"
          :value="currentTime"
          class="playing-progress"
          :max="trackDt"
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
          <div class="song-info mx-2 d-flex align-center">
            <span class="song-name h-1x text-subtitle onSurfaceVariant--text">
              {{ track.name }}
            </span>
            <span class="text--disabled mx-2">-</span>
            <router-link
              :to="`/artist/${$ochain(track, 'ar', '0', 'id')}`"
              class="text-decoration-none text-caption"
            >
              <span class="artist-name h-1x">
                {{ $ochain(track, 'ar', '0', 'name') }}
              </span>
            </router-link>
          </div>
          <v-spacer />
          <like-toggle :id="track.id" />
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
              step="0.1"
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
import { sync, get } from 'vuex-pathify';
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

import LikeToggle from '@components/app/likeToggle.vue';

import VueSlider from 'vue-slider-component';
import { formatDuring } from '@util/fn';
import Control from '@components/app/Control.vue';
import PlayList from '@components/app/PlayingList.vue';

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
    LikeToggle,
  },
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
    track: get('music/track') ?? {},
    playing: get('music/playing'),
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
    trackDt() {
      return Math.ceil((this.track.dt ?? this.track.duration) / 1000) ?? 9999;
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
  },
};
</script>

<style lang="scss" scoped>
.playing-bar {
  z-index: 7;
  bottom: 0;
  left: 5px !important;
  right: 5px !important;
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
