<template>
  <v-app>
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
</template>

<script>
import DefaultNavBar from '@/views/Navbar.vue';
import PlayerBar from '@components/app/playerBar/index'
import PlayingList from '@/components/app/playerBar/playingList';
import DefaultSetting from '@components/app/settings';
import DefaultLogin from '@components/login';
import DefaultTrackDetail from '@/components/app/trackdetail';
import DefaultSnackbar from '@components/default/Snackbar'
import DefaultHeader from '@components/Layout/Header'
import DefaultView from '@components/Layout/View'
import {sync} from 'vuex-pathify';
import { mdiCogOutline, mdiInformation } from '@mdi/js';

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
};
</script>
