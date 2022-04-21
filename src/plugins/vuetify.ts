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

// types

import { App } from 'vue'

export const useVuetify = (app: App) => {

  // const appStore = useAppStore()
  // const playerStore = usePlayerStore()
  // const settingStore = useSettingStore()
  // console.log(appStore, playerStore, settingStore)
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
}

