import { now } from 'lodash-es'

import type { Album, Artist, MV, Playlist, Track } from '@/types'
import { request } from '@/util/fetch'

/**
 * 获取用户收藏歌单
 * @param params
 * @returns
 */
export const getUserPlaylist = (params = {}) => {
  return request<{
    playlist: Playlist[]
  }>('/user/playlist', {
    params: {
      ...params,
      timestamp: now(),
    },
  })
}

/**
 * 获取收藏的专辑
 * @returns
 */
export const favAlbums = () =>
  request<{
    code: number
    data: Album[]
  }>('/album/sublist', { params: { timestamp: now() } })

/**
 * 获取收藏的MV
 * @returns {*}
 */
export const favMVs = () =>
  request<{
    data: MV[]
  }>('/mv/sublist', { params: { timestamp: now() } })
/**
 * 获取收藏的歌手
 * @returns {*}
 */
export const favArtists = () =>
  request<{
    data: Artist[]
  }>('/artist/sublist', { params: { timestamp: now() } })

/**
 * 获取最近播放
 * @param limit
 * @param type
 * @returns
 */
export const recent = (limit = 50, type = 'song') => {
  return request<{
    data: {
      list: []
    }
  }>(`/record/recent/${type}`, {
    params: {
      limit,
      timestamp: now(),
    },
  })
}

/**
 * 私人fm
 */

export const personalFM = () =>
  request<{
    data: Track[]
  }>('/personal_fm', { params: { timestamp: now() } })

/**
 * 私人fm 不喜欢
 */
export const fmToTrash = (id: number) => request('/fm_trash', { params: { id } })

/**
 * 获取推荐歌单（需要登录）
 */
export const recommendPlaylist = () => request('/recommend/resource', { params: { timestamp: now() } })

/**
 * 用户日推歌曲
 * @returns
 */
export const getDailyRecommend = () =>
  request<{
    data: {
      dailySongs: Track[]
      recommendReasons: []
    }
  }>('/recommend/songs')

/**
 * 获取喜欢列表
 */
export const getLikeList = () =>
  request<{
    ids: number[]
    code: number
  }>(`/likelist?timestamp=${now()}`)
