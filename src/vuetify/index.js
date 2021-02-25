import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
} from '@fortawesome/free-solid-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon) // Register component globally
library.add(faPlay, faPause, faHeart, faBackward, faForward, faBars, faUndo, faRandom, faVolumeDown, faVolumeMute, faVolumeUp, faVolumeOff);

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
