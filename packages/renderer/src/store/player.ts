import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive, toRefs, watchEffect } from 'vue'

import { pinia } from '@/plugins/pinia'

import { personalFM } from '../api'
import { sub } from '../api/music'
import type { Playlist, TrackSource } from '../types'
export enum PLAY_MODE {
  NORMAL = 'normal',
  REPEAT = 'repeat',
  REPEAT_ONCE = 'repeatOnce',
  DISABLE = 'disable',
  SHUFFLE = 'shuffle',
}
export type PlayerState = {
  track: null | TrackSource
  currentTime: number
  playingList: {
    id?: string | number
    list: TrackSource[]
  }
  playMode: PLAY_MODE
  shuffle: boolean
  likes: number[]
  playlist: Playlist[]
  volume: number
  playing: boolean
  loadingTrack: boolean
  isCurrentFm: boolean
  fmTrack: null | TrackSource
  fmList: TrackSource[]
  nextTrackId?: TrackSource['id']
  nextFmTrackId?: TrackSource['id']
  prevTrackId?: TrackSource['id']
}
export const usePlayerStore = defineStore({
  id: 'player',
  state: (): PlayerState => {
    const restoreState = useLocalStorage('player', {
      track: null,
      currentTime: 0,
      playingList: {
        list: [] as TrackSource[],
      },
      playMode: PLAY_MODE.NORMAL,
      shuffle: false,
      likes: [] as number[],
      playlist: [] as Playlist[],
      volume: 0.8,
    })

    const data = reactive({
      ...restoreState.value,
      playing: false,
      loadingTrack: false,
      isCurrentFm: false,
      fmTrack: null,
      fmList: [],
    })

    // sync localStorage
    watchEffect(() => {
      restoreState.value.track = data.track as any
      restoreState.value.currentTime = data.currentTime
      restoreState.value.playingList = data.playingList
      restoreState.value.playMode = data.playMode
      restoreState.value.shuffle = data.shuffle
      restoreState.value.likes = data.likes
      restoreState.value.playlist = data.playlist
      restoreState.value.volume = data.volume
    })
    return {
      ...toRefs(data),
    }
  },
  getters: {
    index: (state) => {
      const { playingList, track } = state
      if (!playingList.list.length) return -1
      return playingList.list.findIndex((item) => item.id === track?.id)
    },
    prevTrackId: (state) => {
      const { playingList, track } = state
      if (!playingList.list.length) return -1
      const index = playingList.list.findIndex((item) => item.id === track?.id)
      return playingList.list[index - 1]?.id
    },
    nextFmTrackId(state) {
      return state.fmList[0]?.id
    },
    nextTrackId(state): null | undefined | string {
      const currentId = state.track?.id
      if (!currentId) return null
      const index = this.index
      let id: number | null = null
      const len = state.playingList?.list?.length
      const { playMode, playingList } = state
      if (playMode === PLAY_MODE.REPEAT_ONCE) {
        id = currentId
        // 顺序播放（非最后一曲），或 循环播放，否则下一曲都是当前歌曲
      } else if (playMode === PLAY_MODE.NORMAL || len - 1 !== index) {
        id = playingList?.list?.[index + 1 === len ? 0 : index + 1]?.id
      } else if (playMode === PLAY_MODE.DISABLE && len - 1 === index) {
        // 顺序播放最后一首后不在继续播放
        id = null
      }
      return id
    },
  },
  actions: {
    async toggleFavorite(payload: { id: number; like: boolean }) {
      const { id, like } = payload
      try {
        const { code } = await sub('track', id, like ? 1 : 0)
        if (code === 200) {
          const index = this.likes.findIndex((item) => item.id === id)
          if (index === -1 && like) {
            this.likes.push(id)
          } else {
            this.likes.splice(index, 1)
          }
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    async updatePersonalFmList() {
      const cacheList = [...this.fmList]
      let pop
      if (cacheList.length <= 1) {
        const { data } = await personalFM()
        if (cacheList.length === 1) {
          pop = cacheList.shift()
        } else {
          pop = data?.shift()
        }
        this.fmList = data
      } else {
        pop = cacheList.shift()
        this.fmList = cacheList
      }
      this.fmTrack = pop
      return this.fmTrack
    },
  },
})

export function usePlayerStoreWithOut() {
  return usePlayerStore(pinia)
}
