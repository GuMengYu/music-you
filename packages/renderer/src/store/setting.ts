import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { PLAYING_MODE } from '@/util/enum'

export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export enum ExitMode {
  minimize,
  exit,
  prompt,
}
export enum WallpaperColor {
  RedSandDunes = 'RedSandDunes',
  GreenRockyMountains = 'GreenRockyMountains',
  GreenMountainTop = 'GreenMountainTop',
  OrangeDesert = 'OrangeDesert',
  BlueMountains = 'BlueMountains',
  Customize = 'Customize',
}
export interface VuetifyTheme {
  name: string
  dark: boolean
  colors: Record<string, string>
}
export interface SettingState {
  locale: string
  appearance: APPEARANCE
  wallpaperColor: WallpaperColor
  customTheme: VuetifyTheme[]
  playingMode: PLAYING_MODE
  rail: boolean
  quality: number
  outputdevice: string | undefined
  cacheLimit: number
  volume: number
  account: Record<string, string>
  visualization: boolean
  exitMode: ExitMode
}
export const useSettingStore = defineStore('setting', {
  state: () => {
    return useLocalStorage<SettingState>(
      'setting',
      {
        locale: 'zhCN',
        appearance: APPEARANCE.SYSTEM,
        wallpaperColor: WallpaperColor.GreenRockyMountains,
        playingMode: PLAYING_MODE.MD,
        customTheme: [],
        rail: true,
        quality: 320000,
        outputdevice: undefined,
        cacheLimit: 500,
        volume: 0.8,
        account: {},
        visualization: false,
        exitMode: ExitMode.prompt,
      },
      { mergeDefaults: true }
    )
  },
})
