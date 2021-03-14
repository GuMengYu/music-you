<template>
  <v-sheet class="frame">
    <div
      class="frame-header"
      @click="close"
    />
    <div class="frame-content mt-10 d-flex">
      <div class="frame-content-left">
        <div class="left-container">
          <v-card class="rounded-lg album-cover">
            <v-img
              class="cover-img"
              :src="albumPicUrl"
            />
          </v-card>
          <div class="control_bar d-flex flex-column mt-12 justify-space-between">
            <div class="song-info d-flex justify-space-between mt-4">
              <div class="left d-flex flex-column text-body-1">
                <span class="font-weight-bold">{{ track.name }}</span>
                <span class="font-weight-bold">{{ $ochain(track, 'ar', '0', 'name') }}</span>
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
              <v-slider
                v-model="currentTime"
                class="playing-progress"
                dense
                hide-details
                :max="track.dt / 1000"
                min="0"
                height="10"
                track-color="rgb(128, 128, 128, .2)"
              />
              <div class="time-info d-flex justify-space-between text-caption">
                <span>{{ currentTime * 1000 | formatDuring }}</span>
                <span>{{ track.dt | formatDuring }}</span>
              </div>
            </div>
            <div class="control_btns d-flex justify-space-around mt-4">
              <v-btn
                v-for="button in controlBtns"
                :key="button.val"
                icon
                text
              >
                <v-icon :size="button.size">
                  {{ button.icon }}
                </v-icon>
              </v-btn>
            </div>
            <div class="control_volume mt-4">
              <v-slider
                v-model="volume"
                class="playing-volume"
                dense
                hide-details
                :max="1"
                min="0"
                step="0.01"
                :append-icon="icon.mdiVolumeHigh"
                :prepend-icon="icon.mdiVolumeLow"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="lyric.length"
        class="frame-content-right"
      >
        <div class="frame-lyrics pb-4">
          <div
            v-for="item in lyric"
            :key="item.time"
          >
            {{ item.sentence }}
          </div>
        </div>
      </div>
    </div>
  </v-sheet>
</template>

<script>
import {mdiSkipPrevious, mdiDotsHorizontal, mdiPauseCircle, mdiSkipNext, mdiVolumeLow, mdiVolumeHigh, mdiShuffle, mdiRepeat} from '@mdi/js';
import { get, sync } from 'vuex-pathify'
export default {
  name: 'DefaultTrackDetail',
  data: () => ({
    icon: {
      mdiDotsHorizontal,
      mdiVolumeLow,
      mdiVolumeHigh,
    },
    controlBtns: [{
      val: 1,
      icon: mdiShuffle,
      size: '14',
    }, {
      val: 2,
      icon: mdiSkipPrevious,
      size: '34',
    }, {
      val: 3,
      size: '44',
      icon: mdiPauseCircle,
    }, {
      val: 4,
      size: '34',
      icon: mdiSkipNext,
    }, {
      val: 5,
      icon: mdiRepeat,
      size: '14',
    }],
  }),
  computed: {
    albumPicUrl() {
      return `${this.track.al?.picUrl}?param=512y512`;
    },
    lyric() {
      return this.track.lyric ?? [];
    },
    volume: sync('settings/volume'),
    currentTime: sync('music/currentTime'),
    track: get('music/track'),
  },
  watch: {
    currentTime() {
      console.log(this.currentTime);
    },
  },
  methods: {
    close() {
      this.$emit('close');
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
  padding-top: 2em;
  .frame-header {
    z-index: 10;
    display: flex;
    justify-content: center;
    width: 100%;
    &:before {
      content: '';
      display: block;
      width: 4em;
      height: 0.6em;
      margin: 0 auto;
      z-index: 10;
      border-radius: 10em;
      mix-blend-mode: overlay;
      cursor: pointer;
    }
  }
  .frame-content {
    height: calc(100% - 2.6em - 15px);
    .frame-content-left {
      flex: 1;
      .left-container {
        max-width: 27vw;
        margin: auto;
        .playing-progress {
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
    .frame-content-right {
      height: 100%;
      flex: 1;
      .frame-lyrics {
        height: 100%;
        position: relative;
        z-index: 10;
        font-size: 1.7rem;
        overflow-y: auto;
        font-weight: bold;
        .active {
          //color: white;
          font-size: 2rem;
          margin-top: 0.8em;
        }
        & > div {
          & + div {
            margin-top: 0.8em;
          }
        }
        & > div:not(.active) {
          filter: blur(0.25px);
        }
      }
    }
  }
}
</style>
