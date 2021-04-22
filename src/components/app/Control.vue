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
    <v-fab-transition origin="center center">
      <v-btn
        :key="playingState.icon"
        icon
        class="mx-2"
        elevation="0"
        @click="playPause"
      >
        <v-icon large :color="playingState.color">
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
import { commit, dispatch, get, sync } from 'vuex-pathify';
import { mapGetters } from 'vuex';
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
    ...mapGetters({
      nextFmTrackId: 'music/nextFmTrackId',
      next: 'music/nextTrackId',
      prev: 'music/prevTrackId',
    }),
    orderIconState() {
      return {
        [PLAY_MODE.ORDER]: mdiRepeatOff,
        [PLAY_MODE.CYCLE]: mdiRepeat,
        [PLAY_MODE.SINGLE_CYCLE]: mdiRepeatOnce,
      }[this.mode];
    },
    playingState() {
      return this.playing
        ? { color: 'var(--v-accent-base)', icon: mdiPause }
        : { color: 'var(--v-primary-base)', icon: mdiPlay };
    },
  },
  methods: {
    playOrder() {
      this.mode < 2 ? this.mode++ : (this.mode = 0);
    },
    playPause() {
      commit('music/playing', !this.playing);
    },
    playNext() {
      if (this.isCurrentFm) {
        dispatch('music/updateTrack', { id: this.nextFmTrackId });
        dispatch('music/updatePersonalFmList');
      } else {
        dispatch('music/updateTrack', { id: this.next });
      }
    },
    playPrev() {
      dispatch('music/updateTrack', { id: this.prev });
    },
  },
};
</script>

<style scoped></style>
