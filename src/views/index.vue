<template>
  <v-app class="v-player">
    <app-header />
    <app-nav />
    <app-content class="v-player-content" />
    <app-footer />
    <app-setting />
    <!-- 
    <player-bar />
    <default-setting />
    <playing-page />
    <default-login />
    <context-menu />
    <v-overlay :value="showList" z-index="6" class="overlay" opacity="1" /> -->
  </v-app>
</template>

<script setup>
import AppNav from '@components/app/Navbar.vue';
import AppHeader from '@components/app/Header.vue';
import AppContent from '@components/layout/View.vue';
import AppSetting from '@components/app/setting/index.vue';
import AppFooter from '@components/app/Footer.vue';
</script>
<script>
// import PlayerBar from '@components/app/playerBar/index.vue';
// import DefaultSetting from '@components/app/settings.vue';
// import DefaultLogin from '@components/app/Login.vue';
// import PlayingPage from '@components/app/Playing.vue';

// import ContextMenu from '@components/default/ContextMenu.vue';

// import { sync, get } from 'vuex-pathify';
// import { mdiCogOutline, mdiInformation } from '@mdi/js';

export default {
  name: 'Layout',
  data: () => ({
    // openNav: true,
    // openSetting: false,
    // mdiCogOutline,
    // mdiInformation,
  }),
  computed: {
    // showList: sync('music/showList'),
    // showLyricsPage: get('music/showLyricsPage'),
  },
};
</script>
<style lang="scss" scoped>
// .v-player {
//   &-header,
//   &-nav,
//   &-content {
//     transition-duration: 0.8s !important;
//     transition-timing-function: cubic-bezier(0, 1.34, 0.02, 1.05) !important;
//   }
//   &-header {
//     transition-property: left;
//   }
//   &-nav {
//     transition-property: width;
//   }
//   &-content {
//     transition-property: padding;
//   }
// }
// .theme--light.v-application,
// .theme--dark.v-application {
//   background: var(--v-background-base) !important;
// }
// .overlay {
//   .v-overlay__scrim {
//     backdrop-filter: blur(10px);
//     background-color: rgb(0, 0, 0, 0.3) !important;
//   }
// }
</style>
