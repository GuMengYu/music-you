<template>
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
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" />
  </v-app>
</template>

<script>
import DefaultNavBar from '@/components/layout/Navbar.vue';
import PlayerBar from '@components/app/playerBar/index';
import PlayingList from '@components/app/PlayingList';
import DefaultSetting from '@components/app/settings';
import DefaultLogin from '@components/login';
import DefaultTrackDetail from '@/components/app/trackdetail';
import DefaultSnackbar from '@components/default/Snackbar';
import DefaultHeader from '@components/layout/Header';
import DefaultView from '@components/layout/View';
import { sync } from 'vuex-pathify';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import ContextMenu from '@components/default/ContextMenu';

export default {
  name: 'Layout',
  components: {
    ContextMenu,
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
};
</script>
<style lang="scss">
.theme--dark.v-application {
  background: #1e1e1e !important;
}
.overlay {
  .v-overlay__scrim {
    backdrop-filter: blur(5px);
    background-color: rgb(0, 0, 0, 0.3) !important;
  }
}
</style>
