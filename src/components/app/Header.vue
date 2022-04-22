<template>
  <v-app-bar class="app_header drag-area" elevate-on-scroll flat app>
    <template #prepend>
      <v-app-bar-nav-icon @click="toggleRail"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <v-img
        src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
        alt="gooooooogle"
        width="68"
      />
    </v-app-bar-title>
    <theme-toggle />
    <v-btn icon @click="showSetting">
      <v-icon :icon="mdiCogOutline" />
    </v-btn>
    <account />
    <!--    &lt;!&ndash;      <download-progress />&ndash;&gt;-->
    <!--    <div class="d-flex">-->
    <!--      -->
    <!--      <reload-btn class="no-drag-area" />-->
    <!--    </div>-->
    <!-- <div class="d-flex no-drag-area header-left align-center">
      <b-f />
      <reload-btn />
      <v-btn text v-if="showPlayGround" @click="$router.push('/playground')"
        >playground</v-btn
      >
    </div>
    <v-spacer />
    <div class="d-flex align-center no-drag-area header-right">
      <search-toggle />
      <theme-toggle />
      <default-account :class="showWindowControl ? '' : 'mr-2'" />
      <default-title-bar v-if="showWindowControl" />
    </div> -->

    <!--      <div class="nav_actions">-->
    <!--        <setting-toggle />-->
    <!--        <theme-toggle />-->
    <!--      </div>-->
    <!-- <search /> -->
  </v-app-bar>
</template>
<script setup>
import { mdiCogOutline } from '@mdi/js'

import Account from '@/components/app/Account.vue'
import ThemeToggle from '@/components/app/toggle/Theme.vue'
import { useAppStore } from '@/store/app'
const app = useAppStore()
const toggleRail = () => {
  app.rail = !app.rail
}
const showSetting = () => {
  app.showSetting = !app.showSetting
}
</script>
<script>
// import { mdiMagnify } from '@mdi/js';
// import { get } from 'vuex-pathify';

// import SearchToggle from '@/components/layout/SearchToggle.vue';
// import ThemeToggle from '@/components/layout/ThemeToggle.vue';
// import DefaultAccount from '@/components/app/Account.vue';
// import DefaultTitleBar from '@/components/layout/TitleBar.vue';

// // import SettingToggle from '@/components/layout/SettingToggle';
// import ReloadBtn from '@/components/layout/ReloadBtn.vue';
// import BF from '@/components/layout/BF.vue';
// import Search from '@/views/Search';
// import is from 'electron-is';
// import DownloadProgress from '@/components/layout/DownloadProgress';

export default {
  name: 'DefaultHeader',
  components: {
    // Search,
    // ThemeToggle,
    // SearchToggle,
    // DefaultAccount,
    // DefaultTitleBar,
    // // SettingToggle,
    // ReloadBtn,
    // BF,
    // DownloadProgress,
  },
  props: {
    action: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {
    // account: get('settings/account'),
    // showWindowControl() {
    //   return (is.windows() || is.linux()) && !this.showLyricsPage;
    // },
    // showPlayGround() {
    //   return true;
    // },
  },
  methods: {},
}
</script>
<style scoped lang="scss">
.app_header {
  display: flex;
  z-index: 6;
}
</style>
