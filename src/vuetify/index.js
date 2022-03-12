import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import THEME_PALETTES from './theme';

Vue.use(Vuetify);

export function createVuetify(store) {
  const themePalettes = { ...THEME_PALETTES };
  const customPalette = store.state.settings.customPalette ?? {};
  if (customPalette.dataURL && customPalette.palette) {
    themePalettes.custom = customPalette;
  }
  const palette = themePalettes[store.state.settings.palettes]?.palette ?? {};

  return new Vuetify({
    breakpoint: {
      mobileBreakpoint: 'xs', // 这个值等于600
    },
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: store.state.settings.theme === 'dark',
      options: { customProperties: true },
      themes: {
        light: {
          ...palette.light,
        },
        dark: {
          ...palette.dark,
        },
      },
    },
  });
}
