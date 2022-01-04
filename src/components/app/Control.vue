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
    <v-fab-transition>
      <v-btn
        :key="playingState.icon"
        class="mx-2 play-fab"
        @click="playPause"
        :elevation="0"
        color="primary"
      >
        <v-icon :size="24" color="onPrimary">
          {{ playingState.icon }}
        </v-icon>
      </v-btn>
    </v-fab-transition>
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
const PLAY_MODE = {
  ORDER: 0,
  CYCLE: 1,
  SINGLE_CYCLE: 2,
  RANDOM: 3,
};
export default {
  name: 'Control',
  data() {
    return {
      icon: {
        mdiSkipBackward,
        mdiSkipForward,
      },
    };
  },
  computed: {
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
};
</script>

<style scoped lang="scss">
.play-fab {
  height: 40px !important;
  border-radius: 0.75rem;
}
</style>
