<template>
  <v-fade-transition appear>
    <v-app class="ip-music">
      <default-header />
      <default-nav-bar class="left_nav" />
      <default-view />
      <player-bar />
      <playing-list />
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
    </v-app>
  </v-fade-transition>
</template>

<script>
import DefaultNavBar from '@/components/layout/Navbar.vue';
import PlayerBar from '@components/app/playerBar/index'
import PlayingList from '@components/app/PlayingList';
import DefaultSetting from '@components/app/settings';
import DefaultLogin from '@components/login';
import DefaultTrackDetail from '@/components/app/trackdetail';
import DefaultSnackbar from '@components/default/Snackbar'
import DefaultHeader from '@components/layout/Header'
import DefaultView from '@components/layout/View'
import { call, sync } from 'vuex-pathify'
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import NProgress from 'nprogress'
export default {
  name: 'Layout',
  components: {
    DefaultView,
    DefaultSetting,
    DefaultSnackbar,
    PlayingList,
    PlayerBar,
    DefaultNavBar,
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
  async mounted () {
    NProgress.start();
    await this.init();
    NProgress.done();
  },
  methods: {
    init: call('app/init'),
  },
};
</script>
<style lang="scss">
.theme--dark.v-application {
  background: #1E1E1E !important;
}
</style>
