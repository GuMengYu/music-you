import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { wallpapers } from '@/api/other'
import type { Wallpaper } from '@/types'

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
export enum SORTING {
  RANDOM = 'random',
  RELEVANCE = 'relevance',
  DATE_ADDED = 'date_added',
  VIEWS = 'views',
  FAVORITES = 'favorites',
  TOPLIST = 'toplist',
  HOT = 'hot',
}
export enum ORDER {
  ASC = 'asc',
  DESC = 'desc',
}
export enum TOPRANGE {
  LASTDAY = '1d',
  LAST_THREE_DAYS = '3d',
  LAST_WEEK = '1w',
  LAST_MONTH = '1M',
  LAST_THREE_MONTH = '3M',
  LAST_SIX_MONTH = '6M',
  LAST_YEAR = '1y',
}
export interface WallHavenState {
  wallpapers: Wallpaper[]
  currentIndex: number
  categories: CATGORY[]
  purity: PURITY[]
  sorting: SORTING
  order: ORDER
  topRange: TOPRANGE
  page: number
  apiKey: string | null
  brightness: number
  blur: number
  useTrackCover: boolean
  proxy: {
    open: boolean
    proxy: {
      host: string
      port: number
      protocol: string
    }
  }
}

export const useWallHavenStore = defineStore('wallhaven', {
  state: () => {
    return useLocalStorage<WallHavenState>(
      'wallhaven',
      {
        wallpapers: [],
        currentIndex: 0,
        categories: [CATGORY.GENERAL, CATGORY.ANIME, CATGORY.PEOPLE],
        purity: [PURITY.SFW, PURITY.SKETCHY],
        sorting: SORTING.TOPLIST,
        order: ORDER.DESC,
        topRange: TOPRANGE.LAST_WEEK,
        apiKey: null,
        page: 1,
        brightness: 60,
        blur: 50,
        useTrackCover: true,
        proxy: {
          open: false,
          proxy: {
            host: '127.0.0.1',
            port: 7890,
            protocol: 'http',
          },
        },
      },
      {
        mergeDefaults: true,
      }
    )
  },
  getters: {
    currentWallpaper: (state): Wallpaper | undefined => {
      return state.wallpapers[state.currentIndex]
    },
  },
  actions: {
    async fetch() {
      const cats = `${this.categories.includes(CATGORY.GENERAL) ? 1 : 0}${
        this.categories.includes(CATGORY.ANIME) ? 1 : 0
      }${this.categories.includes(CATGORY.PEOPLE) ? 1 : 0}`
      const purities = `${this.purity.includes(PURITY.SFW) ? 1 : 0}${this.purity.includes(PURITY.SKETCHY) ? 1 : 0}${
        this.purity.includes(PURITY.NSFW) ? 1 : 0
      }`
      // reset page
      this.page = 1
      const params: Record<string, any> = {
        categories: cats,
        purity: purities,
        sorting: this.sorting,
        order: this.order,
        page: this.page,
        proxy: this.proxy,
      }
      if (this.proxy.open) {
        const { protocol, port, host } = this.proxy.proxy
        params.proxy = `${protocol}://${host}:${port}`
      }
      if (this.sorting === SORTING.TOPLIST) {
        params.topRange = this.topRange
      }
      if (this.apiKey) {
        params.apikey = this.apiKey
      }
      const { data: list } = await wallpapers(params as any)
      this.wallpapers = list
    },
  },
})
