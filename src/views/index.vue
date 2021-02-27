<template>
  <v-sheet
    ref="musicApp"
    class="music-app d-flex"
  >
    <default-header />
    <default-nav-bar />
    <playing-list />
    <v-sheet
      tag="main"
      class="px-8"
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-sheet>
    <play-bar />
    <default-setting />
    <v-dialog
      v-model="showLyricsPage"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <default-track-detail @close="showLyricsPage = !showLyricsPage" />
    </v-dialog>
    <default-login />
    <default-snackbar />
  </v-sheet>
</template>

<script>
import DefaultNavBar from '@/views/Navbar.vue';
import PlayBar from '@/components/app/playbar';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import PlayingList from '@/components/app/playbar/playing-list';
import DefaultSetting from '@components/app/settings';
import DefaultLogin from '@components/login';
import DefaultTrackDetail from '@/components/trackdetail';
import DefaultSnackbar from '@components/default/Snackbar'
import DefaultHeader from '@components/Layout/Header'

import {sync} from 'vuex-pathify';
import {debounce} from '@/util/fn';

export default {
  name: 'Layout',
  components: {
    DefaultSetting,
    DefaultSnackbar,
    PlayingList,
    DefaultNavBar,
    PlayBar,
    DefaultLogin,
    DefaultTrackDetail,
    DefaultHeader,
  },
  data: () => ({
    openNav: true,
    openSetting: false,
    mdiCogOutline,
    mdiInformation,
  }),
  computed: {
    showLyricsPage: sync('music/showLyricsPage'),
    showList: sync('music/showList'),
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
@import "../scss/variable";
.music-app {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  transform: translate(0%);
  main {
    width: $contentWidth;
    -webkit-app-region: drag;
    overflow-y: auto;
    padding-top: $toolbarHeight;
    padding-bottom: $playerbarHeight;
    height: 100vh;
    div:first-child {
      -webkit-app-region: no-drag;
    }
  }
}
</style>
