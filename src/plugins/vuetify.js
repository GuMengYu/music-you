// Styles
import 'vuetify/styles'
import {aliases, mdi} from 'vuetify/lib/iconsets/mdi-svg'

// Vuetify
import {createVuetify} from 'vuetify'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from "@/store/player"
import { useSettingStore } from '@/store/setting'
import * as components from 'vuetify/lib/components/index'
import * as directives from 'vuetify/lib/directives/index'
import themes from './theme'
export const useVuetify = (app) => {
  console.log(useAppStore().$state)
  console.log(usePlayerStore().$state)
  console.log(useSettingStore().$state)

  console.log(themes)
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
      defaultTheme: 'RedSandDunesDark',
      themes,
    },
  })
  app.use(vuetify)
}

