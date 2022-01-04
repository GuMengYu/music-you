import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import themePalettes from './theme';

Vue.use(Vuetify);

export function createVuetify(store) {
  const palettes = themePalettes[store.state.settings.palettes]?.palette ?? {};
  return new Vuetify({
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: store.state.settings.theme === 'dark',
      options: { customProperties: true },
      themes: {
        light: {
          ...palettes.light,
        },
        dark: {
          ...palettes.dark,
        },
      },
    },
  });
}
