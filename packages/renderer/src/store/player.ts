import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive, toRefs, watchEffect } from 'vue'

import { pinia } from '@/plugins/pinia'

import { personalFM } from '../api/user'
import type { Track } from '../types'
import { usePlayQueueStore } from './playQueue'
export enum PLAY_MODE {
  NORMAL = 'normal',
  REPEAT = 'repeat',
  REPEAT_ONCE = 'repeatOnce',
  DISABLE = 'disable',
}
export interface PlayerState {
  track: Track | null
  currentTime: number
  playMode: PLAY_MODE
  shuffle: boolean
  volume: number
  playing: boolean
  loadingTrack: boolean
  isCurrentFm: boolean
  fmTrack: null | Track
  fmList: Track[]
  popNextTrackId: () => number
  popPrevTrackId: () => number
  setQueue: (trackId: number) => void
}
export const usePlayerStore = defineStore({
  id: 'player',
  state: (): PlayerState => {
    const restoreState = useLocalStorage('player', {
      track: null,
      currentTime: 0,
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
      restoreState.value.track = data.track
      restoreState.value.currentTime = data.currentTime
      restoreState.value.playMode = data.playMode
      restoreState.value.shuffle = data.shuffle
      restoreState.value.volume = data.volume
    })
    return {
      ...toRefs(data),
    }
  },
  actions: {
    popNextTrackId() {
      const playQueue = usePlayQueueStore()
      if (this.playMode === PLAY_MODE.NORMAL) {
        if (playQueue.queue.states.length) {
          return playQueue.queue.states.shift()
        } else {
          return null
        }
      } else if (this.playMode === PLAY_MODE.REPEAT) {
        if (!playQueue.queue.states.length) {
          playQueue.restoreStates()
        }
        return playQueue.queue.states.shift()
      }
    },
    popPrevTrackId() {
      const playQueue = usePlayQueueStore()
      const sequence = playQueue.queue.sequence
      // 处于第一首时，不能再往前
      if (playQueue.queue.states.length === sequence.length - 1) {
        return null
      } else {
        // 往前移动一首，取回前一首放到队列开头, 并返回前一首id
        const prev = sequence[sequence.length - playQueue.queue.states.length - 1]
        const prev2 = sequence[sequence.length - playQueue.queue.states.length - 2]
        if (prev2) {
          playQueue.queue.states.unshift(prev)
          return prev2
        } else {
          return null
        }
      }
    },
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
