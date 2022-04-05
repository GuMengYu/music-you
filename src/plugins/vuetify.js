// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/lib/iconsets/mdi-svg'

// Vuetify
import {createVuetify} from 'vuetify'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from "@/store/player"
import * as components from 'vuetify/lib/components/index'
import * as directives from 'vuetify/lib/directives/index'

export const useVuetify = (app) => {
  console.log(useAppStore().$state)
  console.log(usePlayerStore().$state)

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
    },
    theme: {
      themes: {
        light: {
          colors: {
            primary: '#1867c0',
            secondary: '#5CBBF6',
            tertiary: '#E57373',
            accent: '#005CAF',
          },
        },
      },
    },
  })
  app.use(vuetify)
}

