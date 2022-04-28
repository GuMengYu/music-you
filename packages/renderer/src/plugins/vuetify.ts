// Styles
// import 'vuetify/styles'
import '../styles/main.scss'

// types
import type { App } from 'vue'
// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components/index'
import * as directives from 'vuetify/lib/directives/index'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'

import themes from './theme'

export const useVuetify = (app: App) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    display: {
      mobileBreakpoint: 'xs',
      thresholds: {
        xs: 0,
        sm: 340,
        md: 540,
        lg: 800,
        xl: 1280,
      },
    },
    theme: {
      defaultTheme: 'RedSandDunesDark',
      themes,
    },
  })
  app.use(vuetify)
  return vuetify
}
