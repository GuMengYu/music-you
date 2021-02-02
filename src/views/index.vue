<template>
  <v-sheet
    ref="musicApp"
    class="music-app d-flex"
    elevation="1"
  >
    <side-nav />
    <div class="right">
      <play-bar />
      <playing-list
        :open="true"
        class="playing-list"
      />
      <v-sheet tag="main">
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-sheet>
    </div>
    <settings />
    <v-dialog
      v-model="showLyricsPage"
      fullscreen
      transition="dialog-top-transition"
    >
      <play-content :song="song" @close="showLyricsPage = !showLyricsPage" />
    </v-dialog>
    <login />
  </v-sheet>
</template>

<script>
import SideNav from './nav.vue';
import PlayBar from './playbar/index';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import PlayingList from '@/views/playbar/playing-list';
import Settings from '@components/settings';
import Login from '@components/login';
import PlayContent from '@/views/playbar/play-content';
import {sync} from 'vuex-pathify';


import {debounce} from '@/util/fn';
import { mapState } from 'vuex'
export default {
  name: 'Layout',
  components: {PlayingList, SideNav, PlayBar, Settings, Login, PlayContent},
  data: () => ({
    openNav: true,
    openSetting: false,
    mdiCogOutline,
    mdiInformation,
  }),
  computed: {
    ...mapState({
      song: state => state.music.song,
    }),
    showLyricsPage: sync('music/showLyricsPage'),
  },
  mounted () {
    this.handleWindowResize();
    window.onresize = debounce(this.handleWindowResize, 500, false);
  },
  methods: {
    handleWindowResize() {
      console.log('resizing');
      const {innerHeight, innerWidth} = window;
      const $app = this.$refs['musicApp'].$el;
      Object.assign($app.style, {maxWidth: innerWidth + 'px', maxHeight : innerHeight + 'px'});
    },
  },
};
</script>
<style lang="scss" scoped>
$playerbarHeight: 70px;
.music-app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transform: translate(0%);
  .playing-list {
    top: 62px!important;
    height: calc(100% - #{$playerbarHeight}) !important;
  }
  .right {
    width: calc(100% - 20%);
  }
  main {
    max-height: calc(100% - #{$playerbarHeight});
    overflow-y: auto;
    padding: 2vw 2vw 0;
  }
}
</style>
