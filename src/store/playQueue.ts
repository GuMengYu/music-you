import { useLocalStorage } from '@vueuse/core'
import { cloneDeep, pick, shuffle } from 'lodash-es'
import { defineStore } from 'pinia'

import { pinia } from '@/plugins/pinia'
import type { listType, Program, SimpleTrack, Track, TrackFrom } from '@/types'

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

const simpleTracks = (tracks: Track[]) => {
  return tracks.map((track) => pick(track, ['id', 'name', 'source']) as any as SimpleTrack)
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
  actions: {
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
      this.queue = {
        id,
        type,
        name,
        sequence: [...tracks], // deep copy avoid mutation of sequence and states
        states: [...tracks],
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
    clearQueue() {
      this.queue = {
        sequence: [],
        states: [],
        tracks: [],
      }
    },
    /**
     * 添加歌曲到待播放列表
     * @param track
     * @param from
     */
    addToPlayQueue(track: Track | Program, from: TrackFrom) {
      mixinTrackSource(track, from)
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
      const shuffled = shuffle(this.queue.sequence)
      this.queue.sequence = shuffled
      this.queue.states = shuffled.slice(shuffled.length - this.queue.states.length)
    },
    /**
     * 恢复队列
     */
    unShuffle() {
      const tracks = simpleTracks(this.queue.tracks)
      this.queue.sequence = tracks
      this.queue.states = tracks.slice(tracks.length - this.queue.states.length)
    },
    restoreStates() {
      this.queue.states = [...this.queue.sequence]
    },
    // 按照歌曲id 更新队列
    setQueue(id: number) {
      const foundIndex = this.queue.states.findIndex((item) => item.id === id)
      if (foundIndex > -1) {
        this.queue.states.splice(0, foundIndex + 1)
      }
    },
  },
})

export function usePlayQueueStoreWithOut() {
  return usePlayQueueStore(pinia)
}

export function mixinTrackSource(track: Track | Program, from: TrackFrom) {
  const url = {
    album: `/album/${from.id}`,
    playlist: `/playlist/${from.id}`,
    artist: `/artist/${from.id}`,
    daily: `/daily`,
    cloud: '/library/cloud',
    recent: '/recent',
    intelligence: '',
    program: `/podcast/${from.id}`,
    unknown: '',
  }[from.type as listType]
  track.source = {
    fromUrl: url,
    fromType: from.type,
    fid: from.type,
    fdata: from.id,
    from,
  }
  if (from.type === 'program') {
    track.program = cloneDeep(track)
  }
}
