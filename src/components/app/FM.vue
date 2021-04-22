<template>
  <v-card class="d-flex justify-lg-space-between flex-column rounded-lg fm">
    <v-responsive :aspect-ratio="1" class="cover-wrapper">
      <div
        style="width: 100%; height: 100%"
        class="d-flex justify-center align-center flex-column"
      >
        <v-progress-circular
          :rotate="-90"
          :value="progress"
          size="168"
          color="primary lighten-1"
          class="cover rounded-circle"
        >
          <v-img
            :src="albumCoverImgUrl"
            class="rounded-circle"
            max-width="160"
            max-height="160"
          />
        </v-progress-circular>
        <div class="d-flex flex-column text-center mt-2">
          <span class="text-body-2 h-1x">
            {{ albumName }} - {{ fmTrack.name }}
          </span>
        </div>
      </div>
    </v-responsive>
    <div class="fm-action d-flex align-center justify-center">
      <v-btn icon text class="mx-2" @click="trash">
        <div>
          <v-icon v-text="icon.mdiThumbDown" />
        </div>
      </v-btn>
      <v-fab-transition origin="center center">
        <v-btn
          :key="playingState.icon"
          icon
          fab
          height="45"
          width="45"
          class="mx-2"
          @click="play"
        >
          <v-icon
            v-text="playingState.icon"
            :color="playingState.color"
            large
          />
        </v-btn>
      </v-fab-transition>
      <v-btn icon class="mx-2" @click="next">
        <v-icon v-text="icon.mdiSkipForward" />
      </v-btn>
    </div>
  </v-card>
</template>
<script>
import { get, sync, dispatch, commit } from 'vuex-pathify';
import { mapGetters } from 'vuex';
import { fmToTrash } from '@/api';
import { sizeOfImage } from '@/util/fn';
import { mdiThumbDown, mdiPlay, mdiSkipForward, mdiPause } from '@mdi/js';

export default {
  name: 'FM',
  data: () => ({
    icon: {
      mdiThumbDown,
      mdiPlay,
      mdiSkipForward,
      mdiPause,
    },
  }),
  computed: {
    fmTrack: get('music/fmTrack'),
    track: get('music/track'),
    isCurrentFm: sync('music/isCurrentFm'),
    playerPlaying: get('music/playing'),
    fmPlaying() {
      return this.playerPlaying && this.isCurrentFm;
    },
    playingState() {
      return this.fmPlaying
        ? { color: 'var(--v-accent-base)', icon: mdiPause }
        : { color: 'var(--v-primary-base)', icon: mdiPlay };
    },
    currentTime: get('music/currentTime'),
    progress() {
      return this.isCurrentFm
        ? ~~(this.currentTime * 1000) / ~~(this.track?.dt / 100)
        : 0;
    },
    albumCoverImgUrl() {
      return sizeOfImage(
        this.fmTrack.al?.picUrl ?? this.fmTrack.album?.picUrl,
        256,
      );
    },
    albumName() {
      return this.fmTrack.ar?.[0]?.name ?? this.fmTrack.artists?.[0]?.name;
    },
    ...mapGetters({
      nextFmTrackId: 'music/nextFmTrackId',
    }),
  },
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      const pop = await dispatch('music/updatePersonalFmList');
      commit('music/fmTrack', pop);
    },
    async play() {
      if (this.fmTrack.id !== this.track.id) {
        commit('music/isCurrentFm', true);
        await dispatch('music/updateTrack', { id: this.fmTrack.id });
      } else {
        commit('music/playing', !this.fmPlaying);
      }
    },
    async next() {
      commit('music/isCurrentFm', true);
      await dispatch('music/updateTrack', { id: this.nextFmTrackId });
      await dispatch('music/updatePersonalFmList');
    },
    async trash() {
      await fmToTrash(this.fmTrack.id);
      await this.next();
    },
  },
};
</script>
<style scoped lang="scss">
.fm {
  background-color: var(--v-neumorphism-base) !important;
  .cover-wrapper {
    > ::v-deep .v-image__image {
      background: var(--v-neumorphism-base) !important;
    }
  }
  .cover {
    box-shadow: 9px 9px 18px var(--v-neumorphism-darken1),
      -9px -9px 18px var(--v-neumorphism-lighten1);
  }
  .fm-action {
    height: 68px;
    ::v-deep .v-progress-circular__underlay {
      stroke: none;
    }
    ::v-deep .v-btn {
      box-shadow: 9px 9px 18px var(--v-neumorphism-darken1),
        -9px -9px 18px var(--v-neumorphism-lighten1);
    }
  }
}
</style>
