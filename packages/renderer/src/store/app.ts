import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { getAccount } from '../api/account'
import type { Account } from '../types'

export enum WindowState {
  NORMAL = 'normal',
  MAXIMIZED = 'maximized',
  MINIMIZED = 'minimized',
}
export type AppState = {
  account: Account
  rail: boolean
  showSetting: boolean
  showLogin: boolean
  showSearch: boolean
  showAddToPlayList: boolean
  toPlayListTrackId: null | number
  windowState: WindowState
}
export const useAppStore = defineStore('app', {
  state: () => {
    const account = useLocalStorage('account', {})
    const state = reactive<AppState>({
      account,
      rail: false,
      showSetting: false,
      showLogin: false,
      showSearch: false,
      showAddToPlayList: false,
      toPlayListTrackId: null,
      windowState: WindowState.NORMAL,
    })
    return {
      ...toRefs(state),
    }
  },
  getters: {
    logged: (state) => {
      return !!state.account?.profile?.userId
    },
  },
  actions: {
    async refreshAccount() {
      const account = await getAccount()
      this.account = account
      return account
    },
  },
})
