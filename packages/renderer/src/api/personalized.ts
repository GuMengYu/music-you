import type { Playlist, Track } from '@/types'
import { request } from '@/util/fetch'
import { RADARPLAYLISTS } from '@/util/metadata'

/**
 * 获取推荐歌单列表
 * @param {number} limit 返回数量限制
 * @returns
 */
export const personalizedPlaylist = (limit?: number) => {
  return request<{
    category: number
    code: number
    result: []
    hasTaste: boolean
  }>('/personalized', { params: { limit } })
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
