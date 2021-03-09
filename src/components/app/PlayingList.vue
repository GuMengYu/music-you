<template>
  <v-sheet
    v-show="showList"
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
      max-width="350"
      class="playing-container-list overflow-y-auto"
    >
      <v-list-item-group
        color="primary"
      >
        <song-bar
          v-for="(song, i) in nextList"
          :key="i"
          :song="song"
        />
      </v-list-item-group>
    </v-list>
  </v-sheet>
</template>

<script>
import { mdiCloseCircle } from '@mdi/js';
import {sync, get} from 'vuex-pathify';
import SongBar from '@/components/app/SongBar';
export default {
  name: 'PlayingList',
  components: {SongBar},
  data(){
    return {
      icon: {mdiCloseCircle},
    };
  },
  inject: ['theme'],
  computed: {
    playingList: get('music/playingList'),
    current: get('music/track@id'),
    showList: sync('music/showList'),
    nextList() {
      const idx = this.playingList.findIndex(i => i.id === this.current);
      return this.playingList.slice(idx + 1);
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
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 7;
  backdrop-filter: blur(30px);
  .playing-container-list {
    background: transparent;
    &::-webkit-scrollbar {
      width: 0;
    }
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
</style>
