import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export enum APPEARANCE {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}
export enum PURITY {
  SFW = 'sfw',
  SKETCHY = 'sketchy',
  NSFW = 'nsfw',
}
export enum CATGORY {
  GENERAL = 'general',
  ANIME = 'anime',
  PEOPLE = 'people',
}
export const useSettingStore = defineStore('setting', {
  state: () => {
    const data = useLocalStorage('setting', {
      locale: 'en',
      appearance: APPEARANCE.SYSTEM,
      wallpaperColor: 'GreenRockyMountains',
      customPalettes: {
        dataURL: '',
        colors: {},
      },
      quality: '320000',
      cacheLimit: 500,
      volume: 0.8,
      account: {},
      playingMode: 'basic',
      wallhaven: false,
      purity: [PURITY.SFW, PURITY.SKETCHY],
      categories: [CATGORY.GENERAL, CATGORY.ANIME, CATGORY.PEOPLE],
    })
    return data
  },
})
