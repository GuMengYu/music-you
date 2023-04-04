// Utilities
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

import { getAccount, getVipInfo, logout } from '@/api/account'
import { sub } from '@/api/music'
import { getLikeList, getUserPlaylist } from '@/api/user'
import type { Account, Playlist } from '@/types'
import { specialType } from '@/util/metadata'

type Nullable<T> = T | null
export interface UserState {
  account: Nullable<Account>
  likes: number[]
  playlists: Playlist[]
  signOut?: () => void
  refreshAccount?: () => Promise<Account>
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
    createdPlaylists(state): Playlist[] {
      return state.playlists.filter((i) => i.creator.userId === this.uid)
    },
    subscribedPlaylists(state): Playlist[] {
      return state.playlists.filter((i) => i.creator.userId !== this.uid)
    },
  },
  actions: {
    async fetch() {
      if (this.logged) {
        const [likesRes, playlistRes] = await Promise.all([
          getLikeList(),
          getUserPlaylist({
            timestamp: new Date().getTime(),
            uid: this.uid,
          }),
          this.refreshAccount(),
        ])
        this.likes = likesRes.ids
        this.playlists = playlistRes.playlist
      }
    },
    async flushPlaylist() {
      const { playlist } = await getUserPlaylist({
        timestamp: new Date().getTime(),
        uid: this.uid,
      })
      this.playlists = playlist
    },
    async refreshAccount() {
      const account = await getAccount()
      if (account.profile.vipType === 11) {
        const vipInfo = await getVipInfo()
        account.vipInfo = vipInfo.data
      }
      this.account = account
      return account
    },
    async signOut() {
      await logout()
      this.account = null
    },
    async favSong(id: number, like: boolean) {
      let likes = this.likes
      try {
        const { code } = await sub('track', id, like ? 1 : 0)
        if (code === 200) {
          if (like) {
            likes.push(id)
          } else {
            likes = likes.filter((i) => i !== id)
          }
          this.likes = likes
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
  },
})
