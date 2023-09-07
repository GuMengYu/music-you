import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useSnackbar } from 'notistack'
import { useAppStore } from './app'
import { getAccount, getVipInfo } from '@/api/account'
import type { Account, Playlist } from '@/types'
import { getLikeList, getUserPlaylist } from '@/api/user'
import { sub } from '@/api/music'
import { specialType } from '@/util/metadata'

interface userState {
  account: null | Account
  likes: number[]
  playlists: Playlist[]
}
interface userAction {
  refreshAccount: () => void
  fetchAccount: () => void
  favSong: (id: number, liked: boolean) => Promise<boolean>
  getFavs: () => Playlist
}
export const useUserStore = create(persist<userState & userAction>((set, get) => {
  return {
    account: null,
    likes: [],
    playlists: [],
    async refreshAccount() {
      const account = await getAccount()
      if (account.account && account.profile) {
        if (account.profile.vipType === 11) {
          const vipInfo = await getVipInfo()
          account.vipInfo = vipInfo.data
        }
        set({
          account,
        })
      }
      else {
        const { toggleLogin } = useAppStore()
        const { enqueueSnackbar } = useSnackbar()
        enqueueSnackbar('Your session has expired. Please log in again.', {
          autoHideDuration: 1000,
          anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        })
        toggleLogin(true)
      }
    },
    async fetchAccount() {
      const uid = get().account?.profile?.userId
      const logged  = !!uid
      if (logged) {
        const [, likesRes, playlistRes] = await Promise.all([
          this.refreshAccount(),
          getLikeList(),
          getUserPlaylist({
            timestamp: new Date().getTime(),
            uid,
          }),
        ])
        set({
          likes: likesRes.ids,
          playlists: playlistRes.playlist,
        })
      }
    },
    async favSong(id: number, like: boolean) {
      let likes = get().likes
      try {
        const { code } = await sub('track', id, like ? 1 : 0)
        if (code === 200) {
          if (like) 
            likes.push(id)
          else 
            likes = likes.filter(i => i !== id)
          
          set({
            likes,
          })
          return true
        }
        else {
          return false
        }
      }
      catch (e) {
        return false
      }
    },
    getFavs() {
      return (get().playlists.find(playlist => playlist.specialType === specialType.fav.type) ?? {}) as Playlist
    },
  }
}, {
  name: 'user',
  storage: createJSONStorage(() => localStorage),
}))
