<template>
  <v-app-bar
    app
    fixed
    dense
    :elevation="0"
    class="app_header surface"
    :class="action ? 'justify-start' : 'justify-end'"
  >
    <!--      <download-progress />-->
    <div class="d-flex">
      <b-f class="no-drag-area" />
      <reload-btn class="no-drag-area" />
    </div>
    <div class="d-flex align-center no-drag-area">
      <default-input
        v-show="showSearch"
        v-model="keywords"
        :holder="$t('common.search_type_2')"
        :icon="icon.mdiMagnify"
        class="search_input"
        @enter="goSearch"
      >
        <default-account />
      </default-input>
      <theme-toggle />
    </div>

    <!--      <div class="nav_actions">-->
    <!--        <setting-toggle />-->
    <!--        <theme-toggle />-->
    <!--      </div>-->
  </v-app-bar>
</template>

<script>
import { mdiMagnify } from '@mdi/js';
import { get } from 'vuex-pathify';

import DefaultInput from '@components/default/Input';
import ThemeToggle from '@components/layout/ThemeToggle';
import DefaultAccount from '@components/app/Account';
// import SettingToggle from '@components/layout/SettingToggle';
import ReloadBtn from '@components/layout/ReloadBtn';
import BF from '@components/layout/BF';
// import DownloadProgress from '@components/layout/DownloadProgress';

export default {
  name: 'DefaultHeader',
  components: {
    DefaultInput,
    ThemeToggle,
    DefaultAccount,
    // SettingToggle,
    ReloadBtn,
    BF,
    // DownloadProgress,
  },
  props: {
    action: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['theme'],
  data: () => ({
    icon: { mdiMagnify },
    keywords: '',
  }),
  computed: {
    account: get('settings/account'),
    showSearch() {
      return !this.$vuetify.breakpoint.xs;
    },
  },
  methods: {
    goSearch() {
      const { name, params } = this.$route;
      if (!this.keywords) return;
      if (name === 'search' && params.keywords === this.keywords) return;
      this.$router.push({
        name: 'search',
        params: { keywords: this.keywords },
      });
    },
  },
};
</script>
<style scoped lang="scss">
.app_header {
  display: flex;
  z-index: 6;
  -webkit-app-region: drag;
  .search_input {
    max-width: 20vw;
    min-width: 160px;
  }
}
</style>
