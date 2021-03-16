<template>
  <v-sheet
    class="pa-4 rounded-lg d-flex align-center flex-column fm"
  >
    <v-progress-circular
      :rotate="-90"
      :value="progress"
      size="208"
      color="primary lighten-1"
      class="cover rounded-circle"
    >
      <v-img
        :src="albumCoverImgUrl | sizeOfImage(256)"
        class="rounded-circle"
        max-width="200"
        max-height="200"
      />
    </v-progress-circular>
    <div class="d-flex flex-column mt-8 text-center">
      <span class="text-body-2">
        {{ albumName }}
      </span>
      <span class="mt-2 text-body-1">
        {{ fmTrack.name }}
      </span>
    </div>
    <div class="mt-4">
      <v-btn
        icon
        text
        class="mx-2"
        @click="trash"
      >
        <div>
          <font-awesome-icon icon="thumbs-down" />
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
          <div :style="`color: ${playingState.color};`">
            <font-awesome-icon
              :icon="playingState.icon"
              size="lg"
            />
          </div>
        </v-btn>
      </v-fab-transition>
      <v-btn
        icon
        class="mx-2"
        @click="next"
      >
        <font-awesome-icon
          icon="forward"
        />
      </v-btn>
    </div>
  </v-sheet>
</template>
<script>
import { get, sync, dispatch, commit } from 'vuex-pathify'
import { mapGetters } from 'vuex'
import {fmToTrash} from '@/api';
export default {
  name: 'FM',
  data: () => ({
  }),
  computed: {
    fmTrack: get('music/fmTrack'),
    track: get('music/track'),
    isCurrentFm: sync('music/isCurrentFm'),
    playerPlaying: get('music/playing'),
    fmPlaying() {
      return this.playerPlaying && this.isCurrentFm
    },
    playingState () {
      return this.fmPlaying ? { color: 'var(--v-accent-base)', icon: 'pause' } : { color: 'var(--v-primary-base)', icon: 'play' };
    },
    currentTime: get('music/currentTime'),
    progress() {
      return this.isCurrentFm ? ~~(this.currentTime * 1000) / ~~(this.track?.dt / 100) : 0;
    },
    albumCoverImgUrl() {
      return this.fmTrack.al?.picUrl ?? this.fmTrack.album?.picUrl;
    },
    albumName() {
      return this.fmTrack.ar?.[0]?.name ?? this.fmTrack.artists?.[0]?.name;
    },
    ...mapGetters({
      nextFmTrackId: 'music/nextFmTrackId',
    }),
  },
  created () {
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
        await dispatch('music/updateTrack', {id: this.fmTrack.id});
      } else {
        commit('music/playing', !this.fmPlaying);
      }
    },
    async next() {
      commit('music/isCurrentFm', true);
      await dispatch('music/updateTrack', {id: this.nextFmTrackId});
      await dispatch('music/updatePersonalFmList');
    },
    async trash() {
      await fmToTrash(this.fmTrack.id);
      await this.next();
    },
  },
}
</script>
<style scoped lang="scss">
.fm {
  background-color: var(--v-neumorphism-base);
  .cover {
    box-shadow:  9px 9px 18px var(--v-neumorphism-darken1),
    -9px -9px 18px var(--v-neumorphism-lighten1);
  }
  ::v-deep .v-progress-circular__underlay {
    //stroke: none;
  }
  ::v-deep .v-btn {
    box-shadow:  9px 9px 18px var(--v-neumorphism-darken1),
    -9px -9px 18px var(--v-neumorphism-lighten1);
  }
}

</style>
