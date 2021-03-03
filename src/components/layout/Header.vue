<template>
  <v-app-bar
    app
    fixed
    elevate-on-scroll
    :color="theme.isDark ? void 0 : 'white'"
  >
    <default-input
      :holder="$t('common.search_type_2')"
      :icon="icon.mdiMagnify"
      class="search_input"
    />
    <v-spacer />
    <DefaultAccount />
  </v-app-bar>
</template>

<script>
import {get} from 'vuex-pathify';
import DefaultInput from '@components/default/Input'
import DefaultAccount from '@components/app/Account'
import {mdiMagnify} from '@mdi/js';
export default {
  name: 'DefaultHeader',
  components: {
    DefaultAccount,
    DefaultInput,
  },
  inject: ['theme'],
  data: () => ({
    icon: {mdiMagnify},
  }),
  computed: {
    account: get('settings/account'),
  },
}
</script>
