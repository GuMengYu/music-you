// Utilities
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { getAccount } from '@/api/account'
import { getLikeList, getUserPlaylist } from '@/api/user'
import type { Account, Playlist, TrackSource } from '@/types'
import { specialType } from '@/util/metadata'

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
    favorites: (state) => {
      return (state.playlists.find((playlist) => playlist.specialType === specialType.fav.type) ?? {}) as Playlist
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
