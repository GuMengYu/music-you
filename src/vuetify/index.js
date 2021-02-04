import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import colors from 'vuetify/lib/util/colors'
Vue.use(Vuetify)

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
          primary: colors.red.lighten1,
          'bar-bg': {
            base: '#FFFFFF',
          },
        },
        dark: {
          primary: colors.red.lighten2,
          'bar-bg': {
            base: '#1E1E1E',
          },
        },
      },
    },
  });
}
