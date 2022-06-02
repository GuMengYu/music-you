import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive, toRefs, watchEffect } from 'vue'

import { pinia } from '@/plugins/pinia'

import { sub } from '../api/music'
import { personalFM } from '../api/user'
import type { Playlist, Track } from '../types'
export enum PLAY_MODE {
  NORMAL = 'normal',
  REPEAT = 'repeat',
  REPEAT_ONCE = 'repeatOnce',
  DISABLE = 'disable',
  SHUFFLE = 'shuffle',
}
export interface PlayerState {
  track: null | Track
  currentTime: number
  playingList: {
    id?: string | number
    list: Track[]
  }
  playMode: PLAY_MODE
  shuffle: boolean
  volume: number
  playing: boolean
  loadingTrack: boolean
  isCurrentFm: boolean
  fmTrack: null | Track
  fmList: Track[]
  nextTrackId?: Track['id']
  nextFmTrackId?: Track['id']
  prevTrackId?: Track['id']
}
export const usePlayerStore = defineStore({
  id: 'player',
  state: (): PlayerState => {
    const restoreState = useLocalStorage('player', {
      track: null,
      currentTime: 0,
      playingList: {
        list: [] as Track[],
      },
      playMode: PLAY_MODE.NORMAL,
      shuffle: false,
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
    nextTrackId(state): null | number {
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
    async updatePersonalFmList() {
      // 已有的FM歌曲列表 （最多3首）
      const cacheList = [...this.fmList]
      let pop: Track | undefined
      // 只有一首歌曲时，需要接口拉去新数据
      if (cacheList.length <= 1) {
        const { data } = await personalFM()
        // 只有一首时，直接弹出最后一首，并用新数据替换fmList
        if (cacheList.length === 1) {
          pop = cacheList.shift()
        } else {
          // 先弹出，再更新fmList
          pop = data?.shift()
        }
        this.fmList = data // 更新数据
      } else {
        pop = cacheList.shift()
        this.fmList = cacheList
      }
      pop && (this.fmTrack = pop)
      return this.fmTrack
    },
  },
})

export function usePlayerStoreWithOut() {
  return usePlayerStore(pinia)
}
