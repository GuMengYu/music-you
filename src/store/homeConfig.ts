import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import type { listType } from '@/types'

export type shortcutType = Exclude<listType, 'daily' | 'cloud' | 'intelligence' | 'recent' | 'unknown'>
export enum COLUMNS {
  CUSTOM = 'custom',
  RADAR = 'radar',
  NEW_MUSIC = 'new_music',
  PODCAST = 'podcast',
}
export enum SHORTCUTS {
  FAV = 'fav',
  DAILY = 'daily',
  RADAR = 'radar',
  RECENT = 'recent',
  FM = 'fm',
  PIN = 'pin',
}
export interface homeConfigState {
  shortcuts: SHORTCUTS[]
  columnAndSort: COLUMNS[]
  pinPlaylist: { id: number; title: string; picUrl: string; type: shortcutType } | null
}
export const defaultColumns = [COLUMNS.CUSTOM, COLUMNS.RADAR, COLUMNS.NEW_MUSIC, COLUMNS.PODCAST]
export const defaultShortcuts = [
  SHORTCUTS.FAV,
  SHORTCUTS.DAILY,
  SHORTCUTS.RADAR,
  SHORTCUTS.RECENT,
  SHORTCUTS.FM,
  SHORTCUTS.PIN,
]

export const useHomeConfigStore = defineStore('homeConfig', {
  state: () => {
    return useLocalStorage<homeConfigState>(
      'homeConfig',
      {
        shortcuts: defaultShortcuts,
        columnAndSort: defaultColumns,
        pinPlaylist: null,
      },
      {
        mergeDefaults: true,
      }
    )
  },
  getters: {},
  actions: {},
})
