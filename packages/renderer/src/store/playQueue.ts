import { useLocalStorage } from '@vueuse/core'
import { shuffle } from 'lodash-es'
import { defineStore } from 'pinia'

import { pinia } from '@/plugins/pinia'

import type { Track } from '../types'
export type listType = 'album' | 'playlist' | 'artist' | 'daily'

export interface PlayQueueState {
  queue: {
    id?: number
    type?: listType
    name?: string
    sequence: number[]
    states: number[]
    tracks: Track[]
  }
  priorityQueue: Track[]
}
export const usePlayQueueStore = defineStore({
  id: 'playQueue',
  state: () => {
    return useLocalStorage<PlayQueueState>('playQueue', {
      queue: {
        sequence: [],
        states: [],
        tracks: [],
      },
      priorityQueue: [],
    }) as unknown as PlayQueueState
  },
  getters: {
    // index: (state) => {
    //   const { playingList, track } = state
    //   if (!playingList.list.length) return -1
    //   return playingList.list.findIndex((item) => item.id === track?.id)
    // },
    // prevTrackId: (state) => {
    //   const { playingList, track } = state
    //   if (!playingList.list.length) return -1
    //   const index = playingList.list.findIndex((item) => item.id === track?.id)
    //   return playingList.list[index - 1]?.id
    // },
    // nextFmTrackId(state) {
    //   return state.fmList[0]?.id
    // },
    // nextTrackId(state): null | number {
    //   const currentId = state.track?.id
    //   if (!currentId) return null
    //   const index = this.index
    //   let id: number | null = null
    //   const len = state.playingList?.list?.length
    //   const { playMode, playingList } = state
    //   if (playMode === PLAY_MODE.REPEAT_ONCE) {
    //     id = currentId
    //     // 顺序播放（非最后一曲），或 循环播放，否则下一曲都是当前歌曲
    //   } else if (playMode === PLAY_MODE.NORMAL || len - 1 !== index) {
    //     id = playingList?.list?.[index + 1 === len ? 0 : index + 1]?.id
    //   } else if (playMode === PLAY_MODE.DISABLE && len - 1 === index) {
    //     // 顺序播放最后一首后不在继续播放
    //     id = null
    //   }
    //   return id
    // },
  },
  actions: {
    /**
     * 更新播放列表
     * @param id 队列id
     * @param type 队列类型-专辑/歌单/歌手热门
     * @param name 队列名
     * @param data 队列数据
     */
    updatePlayQueue(id: number, type: listType, name: string, data: Track[]) {
      const trackIds = data.map((track) => track.id)
      this.queue = {
        id,
        type,
        name,
        sequence: [...trackIds], // deep copy aviod mutation of sequence and states
        states: [...trackIds],
        tracks: data,
      }
    },
    /**
     * 更新待播放列表
     * @param list
     */
    updatePriorityQueue(list: Track[]) {
      this.priorityQueue = list
    },
    /**
     * 清空待播放列表
     */
    clearPriorityQueue() {
      this.priorityQueue = []
    },
    /**
     * 添加歌曲到待播放列表
     * @param track
     */
    addToPlayQueue(track: Track) {
      this.priorityQueue.push(track)
    },
    /**
     * 从队列中删除
     * @param trackId
     * @returns
     */
    // deleteFromQueue(trackId: number, from: 'queue' | 'priority') {
    //   if (from === 'queue') {
    //     const index = this.queue.data.findIndex((item) => item.id === trackId)
    //     if (index === -1) return
    //     this.queue.data.splice(index, 1)
    //   } else {
    //     const index = this.priorityQueue.findIndex((item) => item.id === trackId)
    //     if (index === -1) return
    //     this.priorityQueue.splice(index, 1)
    //   }
    // },
    /**
     * 随机队列
     */
    shuffle() {
      const list = this.queue.sequence
      const shuffled = shuffle(list)
      this.queue.sequence = shuffled
      this.queue.states = shuffled.slice(shuffled.length - this.queue.states.length)
    },
    /**
     * 恢复队列
     */
    unShuffle() {
      const ids = this.queue.tracks.map((i) => i.id)
      this.queue.sequence = ids
      this.queue.states = ids.slice(ids.length - this.queue.states.length)
    },
    restoreStates() {
      this.queue.states = [...this.queue.sequence]
    },
    setQueue(id: number) {
      const foundIndex = this.queue.states.findIndex((_id) => _id === id)
      if (foundIndex > -1) {
        this.queue.states.splice(0, foundIndex + 1)
      }
    },
  },
})

export function usePlayQueueStoreWithOut() {
  return usePlayQueueStore(pinia)
}
