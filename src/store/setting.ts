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
  JYEFFECT = 'jyeffect',
  SKY = 'sky',
  JYMASTER = 'jymaster',
}

export enum ExitMode {
  minimize,
  exit,
  prompt,
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
  dynamicBg: boolean
  exitMode: ExitMode
  border: number
  youtubeUnlock: {
    open: boolean
    proxy: string
  }
  unblockNetEaseMusic: {
    open: boolean
    source: string
  }
  outputdevice: string | null
}
interface SettingAction {
  setAppearance: (appearance: APPEARANCE) => void
  setThemeColor: (themeColor: THEME_COLOR) => void
  setQuality: (quality: QUALITY_LEVEL) => void
  setLyricTrans: (enable: SettingState['lyricTrans']) => void
  setDynamicBg: (enable: SettingState['dynamicBg']) => void
  setYoutubeUnlock: (config: SettingState['youtubeUnlock']) => void
  setUnblockNetEaseMusic: (config: SettingState['unblockNetEaseMusic']) => void
  setExitMode: (mode: ExitMode) => void
  setOutputdevice: (outputdevice: SettingState['outputdevice']) => void
  setBorder: (border: number) => void
}
export const useSettingStore = create(subscribeWithSelector(persist<SettingState & SettingAction>((set, get) => {
  return {
    appearance: APPEARANCE.DARK,
    themeColor: THEME_COLOR.GreenRockyMountains,
    quality: QUALITY_LEVEL.HIGHER,
    lyricTrans: false,
    dynamicBg: false,
    exitMode: ExitMode.prompt,
    border: 8,
    youtubeUnlock: {
      open: false,
      proxy: 'http://127.0.0.1:7890',
    },
    unblockNetEaseMusic: {
      open: false,
      source: '',
    },
    outputdevice: null,
    setAppearance: appearance => set({ appearance }),
    setThemeColor: themeColor => set({ themeColor }),
    setQuality: quality => set({ quality }),
    setLyricTrans: lyricTrans => set({ lyricTrans }),
    setDynamicBg: dynamicBg => set({ dynamicBg }),
    setYoutubeUnlock: config => set({ youtubeUnlock: config }),
    setUnblockNetEaseMusic: config => set({ unblockNetEaseMusic: config }),
    setExitMode: exitMode => set({ exitMode }),
    setOutputdevice: outputdevice => set({ outputdevice }),
    setBorder: border => set({ border }),
  }
}, {
  name: 'setting',
  storage: createJSONStorage(() => localStorage),
})))
