<template>
  <v-app-bar
    app
    fixed
    elevate-on-scroll
    :color="theme.isDark ? void 0 : 'white'"
  >
    <b-f />
    <default-input
      :holder="$t('common.search_type_2')"
      :icon="icon.mdiMagnify"
      class="search_input"
    />
    <v-spacer />
    <theme-toggle />
    <setting-toggle class="mx-2" />
    <default-account />
  </v-app-bar>
</template>

<script>
import { get } from 'vuex-pathify'
import DefaultInput from '@components/default/Input'
import DefaultAccount from '@components/app/Account'
import { mdiMagnify } from '@mdi/js'
import ThemeToggle from '@components/layout/ThemeToggle'
import SettingToggle from '@components/layout/SettingToggle'
import BF from '@components/layout/BF'
export default {
  name: 'DefaultHeader',
  components: {
    BF,
    SettingToggle,
    ThemeToggle,
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
