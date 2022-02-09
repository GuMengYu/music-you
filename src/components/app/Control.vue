<template>
  <div class="d-flex justify-center align-center control-buttons">
    <v-btn icon class="mx-2" :disabled="isCurrentFm" @click="toggleShuffle">
      <v-icon small>
        {{ shuffle ? icon.mdiShuffle : icon.mdiShuffleDisabled }}
      </v-icon>
    </v-btn>
    <v-btn class="mx-2" icon :disabled="isCurrentFm" @click="playPrev">
      <v-icon small>{{ icon.mdiSkipBackward }}</v-icon>
    </v-btn>

    <v-btn
      class="mx-2 play-fab"
      :class="{ playing }"
      @click="playPause"
      depressed
      fab
      small
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
    <v-btn class="mx-2" icon :disabled="isCurrentFm" @click="toggleCycle">
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
  mdiShuffle,
  mdiShuffleDisabled,
} from '@mdi/js';

import LottieIcon from '@components/default/Lottie.vue';
import { playToPause as playToPauseAnimationData } from '@util/animationData.json';

const CYCLE_MODE = {
  DISABLE: 0,
  SINGLE_CYCLE: 1,
  CYCLE: 2,
};
export default {
  name: 'Control',
  components: { LottieIcon },
  data() {
    return {
      icon: {
        mdiSkipBackward,
        mdiSkipForward,
        mdiShuffle,
        mdiShuffleDisabled,
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
    cycle_mode: sync('music/cycle_mode'),
    shuffle: sync('music/shuffle'),
    isCurrentFm: get('music/isCurrentFm'),
    orderIconState() {
      return {
        [CYCLE_MODE.DISABLE]: mdiRepeatOff,
        [CYCLE_MODE.CYCLE]: mdiRepeat,
        [CYCLE_MODE.SINGLE_CYCLE]: mdiRepeatOnce,
      }[this.cycle_mode];
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
    toggleShuffle() {
      this.shuffle = !this.shuffle;
    },
    toggleCycle() {
      if (this.cycle_mode === CYCLE_MODE.DISABLE) {
        this.cycle_mode = CYCLE_MODE.CYCLE;
      } else if (this.cycle_mode === CYCLE_MODE.CYCLE) {
        this.cycle_mode = CYCLE_MODE.SINGLE_CYCLE;
      } else {
        this.cycle_mode = CYCLE_MODE.DISABLE;
      }
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
<style lang="scss" scoped>
.play-fab {
  &.playing {
    animation: pulseWarn 1.5s infinite;
  }
}
</style>
