import { useUserStore } from '@/store/user'
import type { Playlist, Podcast, Track } from '@/types'
import { request } from '@/util/fetch'
import { RADARPLAYLISTS } from '@/util/metadata'

import { recommendPlaylist } from './user'
/**
 * 获取推荐歌单列表
 * @param {number} limit 返回数量限制
 * @returns
 */
export const personalized = (limit?: number) => {
  return request<{
    result: Playlist[]
  }>('/personalized', { params: { limit } })
}

export const personalizedPlaylist = async (limit = 7) => {
  const userStore = useUserStore()
  let result: Playlist[]
  if (userStore.logged) {
    const { recommend } = await recommendPlaylist()
    result = recommend.slice(1) // 第一个是私人定制雷达歌单，去除
  } else {
    const { result: list } = await personalized(limit)
    result = list
  }
  return result
}

/**
 * 获取推荐MV
 * @returns
 */
export const personalizedMV = () =>
  request<{
    category: number
    code: number
    result: []
  }>('/personalized/mv')

/**
 * 推荐新歌曲
 * @param {number} limit 返回数量限制
 * @returns
 */
export const personalizedSong = (limit: number) =>
  request<{
    category: number
    code: number
    result: {
      id: number
      name: string
      song: Track
    }[]
  }>('/personalized/newsong', { params: { limit } })

/**
 * 获取推荐雷达歌单
 * @returns
 */
export async function personalizedRadar() {
  const fns = RADARPLAYLISTS.map((playlist) => {
    return request<{
      code: number
      playlist: Playlist
      privileges: []
    }>('/playlist/detail', { params: { id: playlist.id } })
  })
  const result = await Promise.all(fns)
  return result.map((i) => i.playlist)
}

/**
 * 推荐播客
 */
export function personalizedPodcast() {
  return request<{
    code: number
    data: Podcast[]
  }>('/dj/personalize/recommend')
}
