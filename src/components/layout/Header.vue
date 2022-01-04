<template>
  <v-app-bar
    app
    fixed
    dense
    :elevation="0"
    :color="theme.isDark ? void 0 : 'white'"
    class="app_header"
  >
    <div class="no-drag-area d-flex align-center">
      <drawer-toggle />
      <default-input
        v-model="keywords"
        :holder="$t('common.search_type_2')"
        :icon="icon.mdiMagnify"
        class="search_input"
        @enter="goSearch"
      />
      <default-account />
      <div class="nav_actions">
        <setting-toggle />
        <theme-toggle />
      </div>
      <default-title-bar :showActions="showActions" class="no-drag-area" />
    </div>
  </v-app-bar>
</template>

<script>
import { mdiMagnify } from '@mdi/js';
import { get } from 'vuex-pathify';
import is from 'electron-is';

import DefaultInput from '@components/default/Input';
import DrawerToggle from '@components/layout/DrawerToggle';
import DefaultTitleBar from '@components/layout/TitleBar';
import ThemeToggle from '@components/layout/ThemeToggle';
import DefaultAccount from '@components/app/Account';
import SettingToggle from '@components/layout/SettingToggle';

export default {
  name: 'DefaultHeader',
  components: {
    DrawerToggle,
    DefaultInput,
    DefaultTitleBar,
    ThemeToggle,
    DefaultAccount,
    SettingToggle,
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
.app_header {
  -webkit-app-region: drag;
  .no-drag-area {
    -webkit-app-region: no-drag;
  }
  .search_input {
    max-width: 20vw;
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
