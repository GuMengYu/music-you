<template>
  <v-app class="v-player">
    <default-header :action="showActions" class="v-player-header" />
    <default-nav-bar class="v-player-nav" />
    <default-view class="v-player-content" />
    <player-bar />
    <default-setting />
    <playing-page />
    <default-login />
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" />
    <default-title-bar :showActions="showActions" class="no-drag-area" />
  </v-app>
</template>

<script>
import DefaultNavBar from '@components/layout/Navbar.vue';
import PlayerBar from '@components/app/playerBar/index.vue';
import DefaultSetting from '@components/app/settings.vue';
import DefaultLogin from '@components/login/index.vue';
import PlayingPage from '@components/app/Playing.vue';
import DefaultHeader from '@components/layout/Header.vue';
import DefaultView from '@components/layout/View.vue';
import ContextMenu from '@components/default/ContextMenu.vue';
import DefaultTitleBar from '@components/layout/TitleBar.vue';

import { sync, get } from 'vuex-pathify';
import { mdiCogOutline, mdiInformation } from '@mdi/js';
import is from 'electron-is';

export default {
  name: 'Layout',
  components: {
    ContextMenu,
    DefaultView,
    DefaultSetting,
    PlayerBar,
    DefaultNavBar,
    DefaultLogin,
    PlayingPage,
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
    showLyricsPage: get('music/showLyricsPage'),
    showActions() {
      return (is.windows() || is.linux()) && !this.showLyricsPage;
    },
  },
};
</script>
<style lang="scss">
.v-player {
  &-header,
  &-nav,
  &-content {
    transition-duration: 0.8s !important;
    transition-timing-function: cubic-bezier(0, 1.34, 0.02, 1.05) !important;
  }
  &-header {
    transition-property: left;
  }
  &-nav {
    transition-property: width;
  }
  &-content {
    transition-property: padding;
  }
}
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
