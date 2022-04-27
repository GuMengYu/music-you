import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { useUserStore } from '@/store/user'
import { WindowState } from '@/util/enum'

export type AppState = {
  rail: boolean
  showSetting: boolean
  showLogin: boolean
  showSearch: boolean
  showPlaying: boolean
  showAddToPlayList: boolean
  toPlayListTrackId: null | number
  windowState: WindowState
}
export const useAppStore = defineStore('app', {
  state: () => {
    const state = reactive<AppState>({
      rail: false,
      showSetting: false,
      showLogin: false,
      showPlaying: false,
      showSearch: false,
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
