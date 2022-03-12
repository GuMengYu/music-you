<template>
  <v-card
    rounded="xl"
    color="surfaceVariant"
    class="d-flex fm-card"
    flat
    :height="height"
  >
    <v-img
      :max-height="height"
      :max-width="height"
      class="card-img"
      lazy-src="@assets/default-cover.svg"
      :src="albumCoverImgUrl"
    />
    <div
      class="card-info d-flex align-center justify-space-between flex-fill pr-0"
    >
      <span
        :title="`${albumName} - ${fmTrack.name}`"
        class="text-caption font-weight-bold text-decoration-none onSurfaceVariant--text h-2x"
      >
        {{ albumName }} - {{ fmTrack.name }}
      </span>
      <v-card-actions
        class="d-flex align-center justify-center"
        style="height: 48px"
      >
        <v-btn icon @click="trash">
          <v-icon v-text="icon.mdiThumbDown" small />
        </v-btn>
        <v-fab-transition origin="center center">
          <v-btn
            :key="playingState.icon"
            fab
            elevation="0"
            @click="play"
            color="primary"
            x-small
          >
            <v-icon v-text="playingState.icon" color="onPrimary" />
          </v-btn>
        </v-fab-transition>
        <v-btn icon @click="next">
          <v-icon v-text="icon.mdiSkipForward" small />
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>
<script>
import { get, sync, dispatch, commit } from 'vuex-pathify';
import { mapGetters } from 'vuex';
import { fmToTrash } from '@/api';
import { sizeOfImage } from '@util/fn';
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
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
        case 'md':
          return 64;
        case 'lg':
        case 'xl':
          return 80;
        default:
          return 64;
      }
    },
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
        await this.$player.updatePlayerTrack(this.fmTrack.id);
      } else {
        commit('music/playing', !this.fmPlaying);
      }
    },
    async next() {
      commit('music/isCurrentFm', true);
      await this.$player.updatePlayerTrack(this.nextFmTrackId);
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
.fm-card {
  height: 80px;
  .card-info {
    padding: 0 16px;
  }
  .card-img {
    border-top-left-radius: inherit !important;
    border-bottom-left-radius: inherit !important;
    border-top-right-radius: initial !important;
  }
}
</style>
