<template>
  <v-app-bar
    app
    fixed
    dense
    elevate-on-scroll
    :color="theme.isDark ? void 0 : 'white'"
    class="app_header"
  >
    <drawer-toggle />
    <v-spacer />
    <default-input
      v-model="keywords"
      :holder="$t('common.search_type_2')"
      :icon="icon.mdiMagnify"
      class="search_input"
      @enter="goSearch"
    />
  </v-app-bar>
</template>

<script>
import { get } from 'vuex-pathify';
import DefaultInput from '@components/default/Input';
import { mdiMagnify } from '@mdi/js';
import DrawerToggle from '@components/layout/DrawerToggle';
export default {
  name: 'DefaultHeader',
  components: {
    DrawerToggle,
    DefaultInput,
  },
  inject: ['theme'],
  data: () => ({
    icon: { mdiMagnify },
    keywords: '',
  }),
  computed: {
    account: get('settings/account'),
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
  .search_input {
    max-width: 15vw;
  }
}
@media (max-width: 960px) {
  .app_header {
    .search_input {
      max-width: initial;
    }
  }
}
</style>
