<template>
  <div class="d-flex justify-center align-center control-buttons">
    <v-btn icon class="mx-2" :disabled="isCurrentFm" @click="playOrder">
      <v-icon small>
        {{ orderIconState }}
      </v-icon>
    </v-btn>
    <v-btn class="mx-2" icon :disabled="isCurrentFm" @click="playPrev">
      <v-icon small>{{ icon.mdiSkipBackward }}</v-icon>
    </v-btn>

    <v-btn
      :key="playingState.icon"
      class="mx-2 play-fab"
      @click="playPause"
      depressed
      rounded
      color="primary"
      :loading="loadingTrack"
    >
      <lottie-icon
        class="lottie-icon onPrimary--text"
        style="position: relative; top: 1px"
        :options="playOptions"
        :width="30"
        :height="30"
        v-on:animCreated="handleAnimation"
      ></lottie-icon>
      <!--      <v-icon :size="24" color="onPrimary">-->
      <!--        {{ playingState.icon }}-->
      <!--      </v-icon>-->
    </v-btn>

    <v-btn class="mx-2" icon @click="playNext">
      <v-icon small>{{ icon.mdiSkipForward }}</v-icon>
    </v-btn>
    <v-btn class="mx-2" icon :disabled="isCurrentFm" @click="playOrder">
      <v-icon small>
        {{ orderIconState }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import { get, sync } from 'vuex-pathify';
import {
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiSkipBackward,
  mdiSkipForward,
  mdiPause,
  mdiPlay,
} from '@mdi/js';

import LottieIcon from '@components/default/Lottie.vue';
import { playToPause as playToPauseAnimationData } from '@util/animationData.json';

const PLAY_MODE = {
  ORDER: 0,
  CYCLE: 1,
  SINGLE_CYCLE: 2,
  RANDOM: 3,
};
export default {
  name: 'Control',
  components: { LottieIcon },
  data() {
    return {
      icon: {
        mdiSkipBackward,
        mdiSkipForward,
      },
      playAnim: null,
      playOptions: {
        animationData: playToPauseAnimationData,
        loop: false,
        autoplay: false,
      },
    };
  },
  computed: {
    loadingTrack: get('music/loadingTrack'),
    playing: get('music/playing'),
    mode: sync('music/mode'),
    isCurrentFm: get('music/isCurrentFm'),
    orderIconState() {
      return {
        [PLAY_MODE.ORDER]: mdiRepeatOff,
        [PLAY_MODE.CYCLE]: mdiRepeat,
        [PLAY_MODE.SINGLE_CYCLE]: mdiRepeatOnce,
      }[this.mode];
    },
    playingState() {
      return this.playing ? { icon: mdiPause } : { icon: mdiPlay };
    },
  },
  methods: {
    handleAnimation(animation) {
      this.playAnim = animation;
      this.playAnim.setSpeed(2);
    },
    playOrder() {
      this.mode < 2 ? this.mode++ : (this.mode = 0);
    },
    playPause() {
      this.$player.togglePlay();
    },
    playNext() {
      this.$player.next();
    },
    playPrev() {
      this.$player.prev();
    },
  },
  watch: {
    // update play icon state
    async playing(val) {
      await this.$nextTick();
      if (val) {
        this.playAnim?.playSegments([0, 30], true);
      } else {
        this.playAnim?.playSegments([30, 60], true);
      }
    },
  },
};
</script>
