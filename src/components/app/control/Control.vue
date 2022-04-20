<template>
  <div class="d-flex justify-center align-center control-buttons">
    <v-btn icon :disabled="isCurrentFm" @click="toggleShuffle" flat size="small">
      <v-icon size="x-small">
        {{ shuffle ? icon.mdiShuffle : icon.mdiShuffleDisabled }}
      </v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" @click="prev" flat size="small">
      <v-icon size="x-small">{{ icon.mdiSkipBackward }}</v-icon>
    </v-btn>

    <v-btn
        icon
        class="play-fab"
        :class="{ playing }"
        @click="togglePlay"
        size="small"
        color="primary"
        :loading="loadingTrack"
    >
      <lottie-icon
          class="lottie-icon"
          style="position: relative; top: 1px;"
          :options="playOptions"
          :width="30"
          :height="30"
          v-on:animCreated="handleAnimation"
      ></lottie-icon>
      <!--      <v-icon :size="24" color="onPrimary">-->
      <!--        {{ playingState.icon }}-->
      <!--      </v-icon>-->
    </v-btn>

    <v-btn icon @click="next" flat size="small">
      <v-icon size="x-small">{{ icon.mdiSkipForward }}</v-icon>
    </v-btn>
    <v-btn icon :disabled="isCurrentFm" @click="switchMode" flat size="small">
      <v-icon size="x-small">
        {{ orderIconState }}
      </v-icon>
    </v-btn>
  </div>
</template>
<script setup lang="ts">
import {storeToRefs} from "pinia";
import {PLAY_MODE, usePlayerStore} from "@/store/player";
import {usePlayer} from "@/player/player";
import {mdiRepeat, mdiRepeatOff, mdiRepeatOnce} from "@mdi/js";
import {computed} from "vue";

const playerStore = usePlayerStore();
const player = usePlayer();

const {loadingTrack, playing, playMode, shuffle, isCurrentFm} = storeToRefs(playerStore);


const orderIconState = computed(() => {
  return ({
    [PLAY_MODE.DISABLE]: mdiRepeatOff,
    [PLAY_MODE.NORMAL]: mdiRepeat,
    [PLAY_MODE.REPEAT]: mdiRepeat,
    [PLAY_MODE.REPEAT_ONCE]: mdiRepeatOnce,
  })[playMode.value as string] ?? mdiRepeat;
});
const switchMode = () => {
  const mode = playMode.value as string;
  if (mode === PLAY_MODE.DISABLE) {
    playMode.value = PLAY_MODE.NORMAL;
  } else if (mode === PLAY_MODE.NORMAL) {
    playMode.value = PLAY_MODE.REPEAT;
  } else {
    playMode.value = PLAY_MODE.DISABLE;
  }
};


const togglePlay = () => {
  playing.value = !playing.value;
};

const next = () => {
  player.next();
};
const prev = () => {
  player.prev();
};

</script>
<script lang="ts">
import {
  mdiRepeat,
  mdiRepeatOff,
  mdiRepeatOnce,
  mdiSkipBackward,
  mdiSkipForward,
  mdiShuffle,
  mdiShuffleDisabled,
} from '@mdi/js';

import LottieIcon from '@components/LottieIcon.vue';
import {playToPause as playToPauseAnimationData} from '@util/animationData.json';

import {PLAY_MODE} from "@/store/player";

export default {
  name: 'Control',
  components: {LottieIcon},
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
  computed: {},
  methods: {
    handleAnimation(animation) {
      this.playAnim = animation;
      this.playAnim.setSpeed(2);
    },
    toggleShuffle() {
      this.shuffle = !this.shuffle;
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
.control-buttons {
  gap: 12px;

  .play-fab {
    &.playing {
      animation: pulseWarn 1.5s infinite;
    }
  }
}
</style>
