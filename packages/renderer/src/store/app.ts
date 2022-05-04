import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { useUserStore } from '@/store/user'
import { PLAYING_MODE, WindowState } from '@/util/enum'

export type AppState = {
  rail: boolean
  showControlCenter: boolean
  showLogin: boolean
  showSearch: boolean
  showPlaying: boolean
  showLyric: boolean
  playingMode: PLAYING_MODE
  showAddToPlayList: boolean
  toPlayListTrackId: null | number
  windowState: WindowState
}
export const useAppStore = defineStore('app', {
  state: () => {
    const state = reactive<AppState>({
      rail: false,
      showControlCenter: false,
      showLogin: false,
      showPlaying: false,
      showSearch: false,
      showLyric: false,
      playingMode: PLAYING_MODE.BASIC,
      showAddToPlayList: false,
      toPlayListTrackId: null,
      windowState: WindowState.NORMAL,
    })
    return {
      ...toRefs(state),
    }
  },
  actions: {
    async init() {
      const userStore = useUserStore()
      await userStore.init()
    },
  },
})
