import { pick, shuffle } from 'lodash-es'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { Program, SimpleTrack, Track, TrackFrom, listType } from '@/types'
import { mixinTrackSource } from '@/player/base'
import { PLAY_MODE, usePlayerStore } from '@/store/player'

export interface PlayQueueState {
  queue: {
    id?: number
    type?: listType
    name?: string
    sequence: SimpleTrack[]
    states: SimpleTrack[]
    tracks: Track[]
  }
  priorityQueue: Track[]
}

export interface PlayQueueAction {
  updatePlayQueue: (id: number, type: listType, name: string, data: Track[]) => void
  updatePriorityQueue: (list: Track[]) => void
  clearPriorityQueue: () => void
  clearQueue: () => void
  addToPlayQueue: (track: Track | Program, from: TrackFrom) => void
  shuffle: () => void
  unShuffle: () => void
  restoreStates: () => void
  setQueue: (id: number) => void
  getSourceId: () => number | null | undefined
  popNextTrack: () => SimpleTrack | Track | null | undefined
  popPrevTrack: () => SimpleTrack | null | undefined
}

export const playQueueStore = create(persist<PlayQueueState & PlayQueueAction>((set, get) => {
  return {
    queue: {
      sequence: [],
      states: [],
      tracks: [],
    },
    priorityQueue: [],
    // actions
    /**
     * 更新播放列表
     * @param id 队列id
     * @param type 队列类型-专辑/歌单/歌手热门/智能列表/电台节目单
     * @param name 队列名
     * @param data 队列数据
     */
    updatePlayQueue(id: number, type: listType, name: string, data: Track[]) {
      data.forEach((i) => {
        mixinTrackSource(i, { type, id })
      })
      // 精简track, 只在store存储必要的信息
      const tracks = simpleTracks(data)
      set({
        queue: {
          id,
          type,
          name,
          sequence: [...tracks], // deep copy avoid mutation of sequence and states
          states: [...tracks],
          tracks: data,
        },
      })
    },
    /**
     * 更新待播放列表
     * @param list
     */
    updatePriorityQueue(list: Track[]) {
      set({
        priorityQueue: list,
      })
    },
    /**
     * 清空待播放列表
     */
    clearPriorityQueue() {
      set({
        priorityQueue: [],
      })
    },
    clearQueue() {
      set({
        queue: {
          sequence: [],
          states: [],
          tracks: [],
        },
      })
    },
    /**
     * 添加歌曲到待播放列表
     * @param track
     * @param from
     */
    addToPlayQueue(track: Track | Program, from: TrackFrom) {
      mixinTrackSource(track, from)
      set(state => ({ priorityQueue: [...state.priorityQueue, track] }))
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
      const queue = get().queue
      const shuffled = shuffle(queue.sequence)
      const len = queue.states.length
      set(state => ({
        queue: {
          ...state.queue,
          sequence: shuffled,
          states: shuffled.slice(shuffled.length - len),
        },
      }))
    },
    /**
     * 恢复队列
     */
    unShuffle() {
      const queue = get().queue
      const len = queue.states.length
      const tracks = simpleTracks(queue.tracks)
      set(state => ({
        queue: {
          ...state.queue,
          sequence: tracks,
          states: tracks.slice(tracks.length - len),
        },
      }))
    },
    restoreStates() {
      set(state => ({
        queue: {
          ...state.queue,
          states: [...(state.queue.sequence)],
        },
      }))
    },
    // 按照歌曲id 更新队列
    setQueue(id: number) {
      const states = get().queue.states
      const foundIndex = states.findIndex(item => item.id === id)
      if (foundIndex > -1) {
        set(state => ({
          queue: {
            ...state.queue,
            states: states.slice(foundIndex + 1),
          },
        }))
        // this.queue.states.splice(0, foundIndex + 1)
      }
    },
    getSourceId() {
      const queue = get().queue
      return queue.type && ['album', 'playlist', 'artist'].includes(queue.type)
        ? queue.id
        : null
    },
    popNextTrack() {
      const { playMode } = usePlayerStore.getState()
      const { queue, priorityQueue, restoreStates } = get()
      // const playMode = get().playMode

      // 优先播放 priorityQueue 中的歌曲
      if (priorityQueue.length) {
        const track = priorityQueue.shift()
        set(state => ({
          priorityQueue,
        }))
        return track
      }
      if (playMode === PLAY_MODE.NORMAL) {
        if (queue.states.length) {
          const track = queue.states.shift()
          set(state => ({
            queue: {
              ...state.queue,
              states: queue.states,
            },
          }))
          return track
        }
        return null
      }
      else if (playMode === PLAY_MODE.REPEAT) {
        if (!queue.states.length) 
          restoreStates()
        
        const track = queue.states.shift()
        set(state => ({
          queue: {
            ...state.queue,
            states: queue.states,
          },
        }))
        return track
      }
    },
    popPrevTrack() {
      const playQueue = get()
      const sequence = playQueue.queue.sequence
      // 处于第一首时，不能再往前
      if (playQueue.queue.states.length === sequence.length - 1) {
        return null
      }
      else {
        // 往前移动一首，取回前一首放到队列开头, 并返回前一首id
        const prev = sequence[sequence.length - playQueue.queue.states.length - 1]
        const prev2 = sequence[sequence.length - playQueue.queue.states.length - 2]
        if (prev2) {
          set(state => ({
            queue: {
              ...state.queue,
              states: [prev, ...state.queue.states],
            },
          }))
          return prev2
        }
        else {
          return null
        }
      }
    },
  }
}, {
  name: 'playQueue',
  storage: createJSONStorage(() => localStorage),
}))

function simpleTracks(tracks: Track[]) {
  return tracks.map(track => pick(track, ['id', 'name', 'source']) as any as SimpleTrack)
}
