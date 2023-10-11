import { create } from 'zustand'
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware'

export enum THEME_COLOR {
  RedSandDunes = 'RedSandDunes',
  GreenRockyMountains = 'GreenRockyMountains',
  GreenMountainTop = 'GreenMountainTop',
  OrangeDesert = 'OrangeDesert',
  BlueMountains = 'BlueMountains',
  // Customize = 'Customize',
  PurpleDress = 'PurpleDress',
}

export enum QUALITY_LEVEL {
  STANDARD = 'standard',
  HIGHER = 'higher',
  EXHIGH = 'exhigh',
  LOSSLESS = 'lossless',
  HIRES = 'hires',
}
export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
interface SettingState {
  appearance: APPEARANCE
  themeColor: THEME_COLOR
  quality: QUALITY_LEVEL
  lyricTrans: boolean
}
interface SettingAction {
  setAppearance: (appearance: APPEARANCE) => void
  setThemeColor: (themeColor: THEME_COLOR) => void
  setQuality: (quality: QUALITY_LEVEL) => void
  setLyricTrans: (enable: boolean) => void

}
export const useSettingStore = create(subscribeWithSelector(persist<SettingState & SettingAction>((set, get) => {
  return {
    appearance: APPEARANCE.DARK,
    themeColor: THEME_COLOR.GreenRockyMountains,
    quality: QUALITY_LEVEL.HIGHER,
    lyricTrans: false,
    setAppearance: appearance => set({ appearance }),
    setThemeColor: themeColor => set({ themeColor }),
    setQuality: quality => set({ quality }),
    setLyricTrans: lyricTrans => set({ lyricTrans }),
  }
}, {
  name: 'setting',
  storage: createJSONStorage(() => localStorage),
})))
