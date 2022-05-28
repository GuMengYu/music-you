/* eslint-disable import/no-unresolved */
// Styles

import 'vuetify/lib/styles/main.sass'

import type { App } from 'vue'
// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/lib/components/index'
import * as directives from 'vuetify/lib/directives/index'
import { aliases, mdi } from 'vuetify/lib/iconsets/mdi-svg'

import { useSettingStore } from '@/store/setting'

import themes from './theme'

export const useVuetify = (app: App) => {
  const settingStore = useSettingStore()
  const { customPalette, wallpaperColor } = settingStore
  if (wallpaperColor === 'Customize') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    themes['CustomizeLight'] = {
      name: 'CustomizeLight',
      dark: false,
      colors: customPalette.lightColors,
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    themes['CustomizeDark'] = {
      name: 'CustomizeDark',
      dark: true,
      colors: customPalette.darkColors,
    }
  }
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
