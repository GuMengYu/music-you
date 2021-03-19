import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import themePalettes from './theme';
import {
  faHeart,
  faBackward,
  faForward,
  faPlay,
  faPause,
  faBars,
  faUndo,
  faRandom,
  faVolumeDown,
  faVolumeMute,
  faVolumeUp,
  faVolumeOff,
  faThumbsUp,
  faThumbsDown,
  faEllipsisH,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

Vue.component('font-awesome-icon', FontAwesomeIcon); // Register component globally
library.add(
  faPlay,
  faPause,
  faHeart,
  faBackward,
  faForward,
  faBars,
  faUndo,
  faRandom,
  faVolumeDown,
  faVolumeMute,
  faVolumeUp,
  faVolumeOff,
  faThumbsUp,
  faThumbsDown,
  faEllipsisH,
  faPlus,
);

Vue.use(Vuetify);

export function createVuetify(store) {
  const palettes = themePalettes[store.state.settings.palettes]?.palette;
  return new Vuetify({
    icons: {
      iconfont: 'mdiSvg',
    },
    theme: {
      dark: store.state.settings.theme === 'dark',
      options: { customProperties: true },
      themes: {
        light: {
          ...palettes,
          neumorphism: {
            base: '#e0e0e0',
            lighten1: '#fff',
            darken1: '#bebebe',
          },
        },
        dark: {
          ...palettes,
          neumorphism: {
            base: '#363636',
            lighten1: '#3e3e3e',
            darken1: '#2e2e2e',
          },
        },
      },
    },
  });
}
