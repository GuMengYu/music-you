// Utilities
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { getLikeList } from '@/api'
import { getAccount } from '@/api/account'
import { getUserPlaylist } from '@/api/user'
import type { Account, Playlist, TrackSource } from '@/types'

type Nullable<T> = T | null
export type UserState = {
  account: Nullable<Account>
  likes: TrackSource[]
  playlists: Playlist[]
}
export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return useLocalStorage('user', {
      account: null,
      likes: [],
      playlists: [],
    } as UserState)
  },
  getters: {
    logged: (state) => {
      return !!state.account?.profile?.userId
    },
    uid: (state) => {
      return state.account?.profile?.userId
    },
  },
  actions: {
    async init() {
      if (this.logged) {
        const [likesRes, playlistRes] = await Promise.all([
          getLikeList(),
          getUserPlaylist({
            timestamp: new Date().getTime(),
            uid: this.uid,
          }),
        ])
        this.likes = likesRes.ids
        this.playlists = playlistRes.playlist
      }
    },
    async refreshAccount() {
      const account = await getAccount()
      this.account = account
      return account
    },
  },
})
