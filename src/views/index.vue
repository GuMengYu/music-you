<template>
  <v-sheet
    ref="musicApp"
    class="music-app d-flex"
  >
    <side-nav />
    <div class="right">
      <play-bar class="playbar" />
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
    <default-setting />
    <v-dialog
      v-model="showLyricsPage"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <default-track-detail :track="song" @close="showLyricsPage = !showLyricsPage" />
    </v-dialog>
    <default-login />
    <default-snackbar />
  </v-sheet>
</template>

<script>
import SideNav from './nav.vue';
import PlayBar from '@/components/playbar';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import PlayingList from '@/components/playbar/playing-list';
import DefaultSetting from '@components/settings';
import DefaultLogin from '@components/login';
import DefaultTrackDetail from '@/components/trackdetail';
import DefaultSnackbar from '@components/Snackbar'

import {sync} from 'vuex-pathify';
import {debounce} from '@/util/fn';
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    DefaultSetting,
    DefaultSnackbar,
    PlayingList,
    SideNav,
    PlayBar,
    DefaultLogin,
    DefaultTrackDetail,
  },
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
      const {innerHeight, innerWidth} = window;
      const $app = this.$refs['musicApp'].$el;
      Object.assign($app.style, {maxWidth: innerWidth + 'px', maxHeight : innerHeight + 'px'});
    },
  },
};
</script>
<style lang="scss" scoped>
$playerbarHeight: 66px;
.music-app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transform: translate(0%);
  .playing-list {
    height: calc(100% - #{$playerbarHeight}) !important;
  }
  .right {
    width: calc(100% - 20%);
    .playbar {
      position: fixed;
      bottom: 0;
      width: calc(100% - 20%);
    }
  }
  main {
    -webkit-app-region: drag;
    overflow-y: auto;
    padding: 24px 12px #{$playerbarHeight};
    height: 100vh;
    div:first-child {
      -webkit-app-region: no-drag;
    }
  }
}
</style>
