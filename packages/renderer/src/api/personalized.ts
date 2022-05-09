import { now } from 'lodash-es'

import type { Playlist, TrackSource } from '@/types'
import { request } from '@/util/fetch'
import { RADARPLAYLISTS } from '@/util/metadata'

interface personalizedPlaylistModel {
  category: number
  code: number
  result: []
  hasTaste: boolean
}
interface personalizedMvModel {
  category: number
  code: number
  result: []
}
interface personalizedSongsModel {
  category: number
  code: number
  result: {
    id: number
    name: string
    song: TrackSource
  }[]
}
/**
 * 获取推荐歌单列表
 * @param {number} limit 返回数量限制
 * @returns {Promise<personalizedPlaylistModel>}
 */
export const personalizedPlaylist = (limit: number) => {
  return request<personalizedPlaylistModel>('/personalized', { params: { limit } })
}

/**
 * 获取推荐MV
 * @returns {Promise<personalizedMvModel>}
 */
export const personalizedMV = () => request<personalizedMvModel>('/personalized/mv')

/**
 * 推荐新歌曲
 * @param {number} limit 返回数量限制
 * @returns {Promise<personalizedSongsModel>}
 */
export const personalizedSong = (limit: number) =>
  request<personalizedSongsModel>('/personalized/newsong', { params: { limit } })

interface playListModel {
  code: number
  playlist: Playlist
  privileges: []
}
/**
 * 获取推荐雷达歌单
 * @returns {Promise<playListModel[]>}
 */
export async function personalizedRadar() {
  const fns = RADARPLAYLISTS.map((playlist) => {
    return request<playListModel>('/playlist/detail', { params: { id: playlist.id } })
  })
  const result = await Promise.all(fns)
  return result.map((i) => i.playlist)
}
