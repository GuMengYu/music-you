<template>
  <v-app class="ip-music">
    <default-header :action="showActions" />
    <default-nav-bar class="left_nav" />
    <default-view />
    <player-bar />
    <default-setting />
    <track-detail />
    <default-login />
    <default-snackbar />
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" />
    <default-title-bar :showActions="showActions" class="no-drag-area" />
  </v-app>
</template>

<script>
import DefaultNavBar from '@/components/layout/Navbar.vue';
import PlayerBar from '@components/app/playerBar/index';
import DefaultSetting from '@components/app/settings';
import DefaultLogin from '@components/login';
import TrackDetail from '@/components/app/trackdetail';
import DefaultSnackbar from '@components/default/Snackbar';
import DefaultHeader from '@components/layout/Header';
import DefaultView from '@components/layout/View';
import ContextMenu from '@components/default/ContextMenu';
import DefaultTitleBar from '@components/layout/TitleBar';

import { sync } from 'vuex-pathify';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import is from 'electron-is';

export default {
  name: 'Layout',
  components: {
    ContextMenu,
    DefaultView,
    DefaultSetting,
    DefaultSnackbar,
    PlayerBar,
    DefaultNavBar,
    DefaultLogin,
    TrackDetail,
    DefaultHeader,
    DefaultTitleBar,
  },
  data: () => ({
    openNav: true,
    openSetting: false,
    mdiCogOutline,
    mdiInformation,
  }),
  computed: {
    showList: sync('music/showList'),
    showActions() {
      return is.windows() || is.linux();
    },
  },
};
</script>
<style lang="scss">
.theme--light.v-application,
.theme--dark.v-application {
  background: var(--v-background-base) !important;
}
.overlay {
  .v-overlay__scrim {
    backdrop-filter: blur(5px);
    background-color: rgb(0, 0, 0, 0.3) !important;
  }
}
</style>
