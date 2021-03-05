<template>
  <v-btn
    icon
    small
    @click="theme = (dark ? 'light' : 'dark')"
  >
    <v-icon
      small
      :color="dark ? 'amber darken-1' : 'grey'"
    >
      {{ dark ? mdiBrightness1 : mdiBrightness2 }}
    </v-icon>
  </v-btn>
</template>

<script>
import { mdiReload, mdiBrightness1, mdiBrightness2} from '@mdi/js'
import { sync } from 'vuex-pathify'
export default {
  name: 'ThemeToggle',
  data: () =>({mdiReload, mdiBrightness1, mdiBrightness2}),
  computed: {
    theme: sync('settings/theme'),
    dark() {
      return this.$vuetify.theme.dark;
    },
  },
}
</script>

<style scoped>

</style>
