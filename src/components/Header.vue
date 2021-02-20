<template>
  <v-toolbar
    elevation="0"
    class="music-toolbar"
    rounded
  >
    <default-input :holder="$t('common.search_type_2')" :icon="icon.mdiMagnify" class="search_input" />
    <v-spacer />
    <DefaultAccount />
  </v-toolbar>
</template>

<script>
import {get} from 'vuex-pathify';
import DefaultInput from '@components/Input'
import DefaultAccount from '@components/Account'
import {mdiMagnify} from '@mdi/js';
export default {
  name: 'DefaultHeader',
  components: {
    DefaultAccount,
    DefaultInput,
  },
  data: () => ({
    icon: {mdiMagnify},
  }),
  computed: {
    account: get('settings/account'),
  },
}
</script>

<style scoped lang="scss">
@import "../scss/variable";

.music-toolbar {
  position: fixed;
  width: $contentWidth;
  left: 18%;
  z-index: 3;
  .search_input {
    max-width: 20%;
  }
}
</style>
