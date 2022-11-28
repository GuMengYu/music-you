import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { useUserStore } from '@/store/user'
import { WindowState } from '@/util/enum'

export interface AppState {
  showControlCenter: boolean
  showLogin: boolean
  showCommandPalette: boolean
  showPlaying: boolean
  showLyric: boolean
  showSearch: boolean
  windowState: WindowState
}
export const useAppStore = defineStore('app', {
  state: () => {
    const state = reactive<AppState>({
      showControlCenter: false,
      showLogin: false,
      showPlaying: false,
      showCommandPalette: false,
      showLyric: false,
      showSearch: false,
      windowState: WindowState.NORMAL,
    })
    return {
      ...toRefs(state),
    }
  },
  actions: {
    async init() {
      const userStore = useUserStore()
      await userStore.fetch()
    },
  },
})
