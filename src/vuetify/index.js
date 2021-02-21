import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
Vue.use(Vuetify)

import colors from 'vuetify/lib/util/colors'
export function createVuetify (store) {

  return new Vuetify({
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: store.state.settings.theme === 'dark',
      options: { customProperties: true },
      themes: {
        light: {
          primary: colors.amber.darken4,
          'bar-bg': {
            base: '#FFFFFF',
          },
          'reverse-color': {
            base: '#363636',
          },
        },
        dark: {
          primary: '#fe2851',
          'bar-bg': {
            base: '#1E1E1E',
          },
          'reverse-color': {
            base: '#FFF',
          },
        },
      },
    },
  });
}
