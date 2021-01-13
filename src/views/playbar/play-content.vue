<template>
  <v-sheet class="frame">
    <div class="frame-header" @click="close" />
    <v-row class="frame-content">
      <v-col lg="5" class="d-flex flex-column justify-center align-center frame-content-left pa-0">
        <v-card max-height="350" elevation="0" class="rounded-xl album-cover">
          <v-img
            :src="albumPicUrl"
            max-height="350"
            max-width="350"
          />
        </v-card>
        <div class="control_bar d-flex flex-column">
          <div class="song-info d-flex justify-space-between">
            <div class="left d-flex flex-column">
              <span class="white--text text-subtitle-2">{{ song.name }}</span>
              <span class="white--text text-subtitle-1">{{ $$(song, 'ar', '0', 'name') }}</span>
            </div>
            <div class="right d-flex align-center">
              <v-btn icon color="pink">
                <v-icon color="white">
                  {{ icon.mdiDotsHorizontal }}
                </v-icon>
              </v-btn>
            </div>
          </div>
          <div class="control_process">
            <v-slider
              max="100" min="0" color="white"
              thumb-color="white" track-fill-color="white" track-color="white"
            />
          </div>
          <div class="control_btns d-flex">
            <v-btn
              v-for="button in controlBtns"
              :key="button.val"
              icon
              text
              color="white"
            >
              <v-icon :size="button.size">
                {{ button.icon }}
              </v-icon>
            </v-btn>
          </div>
        </div>
      </v-col>
      <v-col lg="7" class="frame-content-right pa-0">
        <div class="frame-lyrics">
          <template v-if="lyric.length">
            <div v-for="item in lyric" :key="item.time">
              {{ item.sentence }}
            </div>
          </template>
          <div v-else>
            暂无歌词
          </div>
        </div>
      </v-col>
      <div class="frame-bg">
        <v-img
          class="bg-color album-artwork"
          :src="albumPicUrl"
        />
        <v-img
          class="bg-black album-artwork"
          :src="albumPicUrl"
        />
      </div>
    </v-row>
  </v-sheet>
</template>

<script>
import {mdiSkipPrevious, mdiDotsHorizontal, mdiPauseCircle, mdiSkipNext} from '@mdi/js';

export default {
  name: 'PlayContent',
  props: {
    song: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    icon: {
      mdiDotsHorizontal,
    },
    controlBtns: [{
      val: 1,
      icon: mdiSkipPrevious,
      size: '24',
    }, {
      val: 2,
      size: '34',
      icon: mdiPauseCircle,
    }, {
      val: 3,
      size: '24',
      icon: mdiSkipNext,
    }],
  }),
  computed: {
    albumPicUrl() {
      return `${this.song.al?.picUrl}?param=400y400`;
    },
    lyric() {
      return this.song.lyric ?? [];
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss">
.frame {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  color: white;
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
      background: white;
      margin: 0 auto;
      z-index: 10;
      border-radius: 10em;
      mix-blend-mode: overlay;
      cursor: pointer;
    }
  }
  .frame-content {
    height: calc(100% - 2.6em - 15px);
    margin: 15px 0 0 0;
    .frame-content-left {
      height: 100%;
      z-index: 10;
      .album-cover {}
      .control_bar {
        width: 350px;
        .control_btns {
          justify-content: space-evenly;
        }
      }
    }
    .frame-content-right {
      height: 100%;
      .frame-lyrics {
        height: 100%;
        position: relative;
        z-index: 10;
        flex-grow: 1;
        padding: 0 2rem 2rem;
        font-size: 2rem;
        overflow-y: auto;
        font-family: "Helvetica", "Arial", sans-serif;
        font-weight: bold;
        .active {
          color: white;
          font-size: 3rem;
          margin-top: 0.8em;
        }
        & > div {
          color: rgba(255, 255, 255, 0.75);
          & + div {
            margin-top: 1.4em;
          }
        }
        & > div:not(.active) {
          filter: blur(0.05px);
        }
        &::-webkit-scrollbar {
          width: 50px;
        }
      }
    }
  }
}

.frame-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.frame-bg .bg-color, .frame-bg .bg-black {
  width: 100%;
  position: absolute;
  border-radius: 100em;
  animation: rotate 100s linear infinite;
}

.frame-bg .bg-color {
  right: 0;
  top: 0;
  filter: blur(50px);
  z-index: 1;
  mix-blend-mode: luminosity;

}

.frame-bg .bg-black {
  left: 0;
  bottom: 0;
  filter: blur(40px);
  z-index: 1;
  animation-direction: reverse;
  animation-delay: 10s;
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
