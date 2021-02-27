<template>
  <v-overlay
    absolute
    :value="showList"
    :opacity="1"
    :dark="theme.isDark"
    :light="!theme.isDark"
    class="playing-container-overlay"
  >
    <v-sheet
      class="rounded-lg playing-container"
    >
      <v-toolbar
        tag="header"
        flat
        class="rounded-lg"
        color="transparent"
      >
        <div class="font-weight-bold">
          {{ $t('main.playing_queue') }}
        </div>
        <v-spacer />
        <v-btn icon>
          <v-icon @click="showList = !showList">
            {{ icon.mdiCloseCircle }}
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-list
        dense
        two-line
        nav
        max-height="70vh"
        width="25vw"
        class="overflow-y-auto"
      >
        <v-list-item-group
          v-model="currentSong"
          color="primary"
        >
          <song-bar
            v-for="(song, i) in playingList"
            :key="i"
            :song="song"
          />
        </v-list-item-group>
      </v-list>
    </v-sheet>
  </v-overlay>
</template>

<script>
import { mdiCloseCircle } from '@mdi/js';
import { mapState } from 'vuex';
import {sync} from 'vuex-pathify';
import SongBar from '@components/app/songbar/index';
export default {
  components: {SongBar},
  data(){
    return {
      icon: {mdiCloseCircle},
    };
  },
  inject: ['theme'],
  computed: {
    ...mapState({
      playingList: state => state.music.playingList,
    }),
    showList: sync('music/showList'),
    currentSong: {
      get() {
        return this.$store.state.music.song?.id;
      },
      set(val) {
        this.$store.dispatch('music/updateTrack', val);
      },
    },
  },
  watch: {
  },
  created() {

  },
  methods: {

  },
};
</script>

<style scoped lang="scss">
.playing-container {
  right: 20px;
  z-index: 2;
  height: 60%;
  bottom: 76px;
  backdrop-filter: blur(30px);
  ::v-deep .v-list {
    background: transparent;
  }
}
.playing-container-overlay {
  >::v-deep .v-overlay__scrim {
    backdrop-filter: blur(5px);
    background-color: rgb(0, 0, 0, .3) !important;
  }
  > ::v-deep .v-overlay__content {
    position: absolute;
    right: 24px;
    bottom: 76px;
  }
}
.theme--light {
  .playing-container {
    background: rgba(255, 255, 255, .5);
  }
}
.theme--dark {
  .playing-container {
    background: rgba(0, 0, 0, .5);
  }
}
.list-delete-button {
  min-width: 20px!important;
  padding: 0!important;
}
</style>
