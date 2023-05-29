import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { ThemeDefinition } from '@/plugins/vuetify'
import { PLAYING_MODE } from '@/util/enum'

export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export enum QUALITY_LEVEL {
  STANDARD = 'standard',
  HIGHER = 'higher',
  EXHIGH = 'exhigh',
  LOSSLESS = 'lossless',
  HIRES = 'hires',
}
export enum ExitMode {
  minimize,
  exit,
  prompt,
}
export enum NavPosition {
  left,
  top,
}
export enum WallpaperColor {
  RedSandDunes = 'RedSandDunes',
  GreenRockyMountains = 'GreenRockyMountains',
  GreenMountainTop = 'GreenMountainTop',
  OrangeDesert = 'OrangeDesert',
  BlueMountains = 'BlueMountains',
  Customize = 'Customize',
}
export interface SettingState {
  locale: string
  appearance: APPEARANCE
  wallpaperColor: WallpaperColor
  customTheme: ThemeDefinition[]
  playingMode: PLAYING_MODE
  rail: boolean
  miniPlayer: boolean
  quality: number // deprecated quality弃用 quality_level替代
  quality_level: QUALITY_LEVEL
  outputdevice: string | undefined
  cacheLimit: number
  volume: number
  account: Record<string, string>
  visualization: boolean
  exitMode: ExitMode
  comment: boolean
  lyricTrans: boolean
  navLeft: boolean // deprecated
  navPosition: NavPosition
  unlock: {
    unblockNetEaseMusic: {
      open: boolean
      source: string
    }
    youtube: {
      open: boolean
      proxy: {
        host: string
        port: number
        protocol?: string
      }
    }
  }
}
export const useSettingStore = defineStore('setting', {
  state: () => {
    return useLocalStorage<SettingState>(
      'setting',
      {
        locale: 'zhCN',
        appearance: APPEARANCE.SYSTEM,
        wallpaperColor: WallpaperColor.GreenRockyMountains,
        playingMode: PLAYING_MODE.SIMPLE,
        customTheme: [],
        rail: true,
        miniPlayer: false,
        quality: 320000,
        quality_level: QUALITY_LEVEL.HIGHER,
        outputdevice: undefined,
        cacheLimit: 500,
        volume: 0.8,
        account: {},
        visualization: false,
        exitMode: ExitMode.prompt,
        comment: false,
        lyricTrans: true,
        navLeft: false,
        navPosition: NavPosition.left,
        unlock: {
          unblockNetEaseMusic: {
            open: false,
            source: '',
          },
          youtube: {
            open: false,
            proxy: {
              host: '127.0.0.1',
              port: 7890,
              protocol: 'http',
            },
          },
        },
      },
      { mergeDefaults: true }
    )
  },
})
