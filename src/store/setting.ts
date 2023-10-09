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
}
interface SettingAction {
  setAppearance: (appearance: APPEARANCE) => void
  setThemeColor: (themeColor: THEME_COLOR) => void
  setQuality: (quality: QUALITY_LEVEL) => void
}
export const useSettingStore = create(subscribeWithSelector(persist<SettingState & SettingAction>((set, get) => {
  return {
    appearance: APPEARANCE.DARK,
    themeColor: THEME_COLOR.GreenRockyMountains,
    quality: QUALITY_LEVEL.HIGHER,
    setAppearance: appearance => set({ appearance }),
    setThemeColor: themeColor => set({ themeColor }),
    setQuality: quality => set({ quality }),
  }
}, {
  name: 'setting',
  storage: createJSONStorage(() => localStorage),
})))
