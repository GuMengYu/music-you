<template>
  <v-navigation-drawer
    v-show="showList"
    fixed
    permanent
    right
    width="300"
  >
    <v-toolbar
      tag="header"
      flat
      class="v-app-underline"
    >
      <div class="font-weight-medium text--primary">
        播放队列
      </div>
    </v-toolbar>
    <v-list
      dense
      two-line
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
  </v-navigation-drawer>
</template>

<script>
import { mdiClose } from '@mdi/js';
import { mapState } from 'vuex';
import {sync} from 'vuex-pathify';
import SongBar from '@components/songbar';
export default {
  components: {SongBar},
  data(){
    return {
      mdiClose,
    };
  },
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
        this.$store.dispatch('music/startNewMusic', val);
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
.list-delete-button {
  min-width: 20px!important;
  padding: 0!important;
}
</style>
