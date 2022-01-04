<template>
  <v-app-bar
    app
    fixed
    dense
    :elevation="0"
    color="background"
    class="app_header"
  >
    <!--      <download-progress />-->
    <div class="d-flex">
      <b-f class="no-drag-area" />
      <reload-btn class="no-drag-area" />
    </div>
    <default-input
      v-model="keywords"
      :holder="$t('common.search_type_2')"
      :icon="icon.mdiMagnify"
      class="search_input"
      @enter="goSearch"
    >
      <default-account />
    </default-input>

    <!--      <div class="nav_actions">-->
    <!--        <setting-toggle />-->
    <!--        <theme-toggle />-->
    <!--      </div>-->
    <default-title-bar :showActions="showActions" class="no-drag-area" />
  </v-app-bar>
</template>

<script>
import { mdiMagnify } from '@mdi/js';
import { get } from 'vuex-pathify';
import is from 'electron-is';

import DefaultInput from '@components/default/Input';
import DefaultTitleBar from '@components/layout/TitleBar';
// import ThemeToggle from '@components/layout/ThemeToggle';
import DefaultAccount from '@components/app/Account';
// import SettingToggle from '@components/layout/SettingToggle';
import ReloadBtn from '@components/layout/ReloadBtn';
import BF from '@components/layout/BF';
// import DownloadProgress from '@components/layout/DownloadProgress';

export default {
  name: 'DefaultHeader',
  components: {
    DefaultInput,
    DefaultTitleBar,
    // ThemeToggle,
    DefaultAccount,
    // SettingToggle,
    ReloadBtn,
    BF,
    // DownloadProgress,
  },
  inject: ['theme'],
  data: () => ({
    icon: { mdiMagnify },
    keywords: '',
  }),
  computed: {
    account: get('settings/account'),
    showActions() {
      return is.windows() || is.linux();
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
.theme--light.app_header,
.theme--dark.app_header {
  background: var(--v-background-base);
}
.app_header {
  display: flex;
  -webkit-app-region: drag;
  .no-drag-area {
    -webkit-app-region: no-drag;
  }
  .search_input {
    max-width: 20vw;
  }
  ::v-deep.v-toolbar__content {
    width: 100%;
    justify-content: space-between;
  }
}
@media (max-width: 600px) {
  .app_header {
    .search_input {
      max-width: initial;
    }
  }
}
</style>
