import { now } from 'lodash-es'

import type { TrackSource } from '@/types'

import { request } from '../util/fetch'

/**
 * 获取用户收藏歌单
 * @param params
 * @returns
 */
export const getUserPlaylist = (params = {}) => {
  return request('/user/playlist', {
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
  }>('/album/sublist', { params: { timestamp: now() } })

/**
 * 获取收藏的MV
 * @returns {*}
 */
export const favMVs = () => request('/mv/sublist', { params: { timestamp: now() } })
/**
 * 获取收藏的歌手
 * @returns {*}
 */
export const favArtists = () => request('/artist/sublist', { params: { timestamp: now() } })

/**
 * 获取用户电台
 * @returns {*}
 */
export const getUserAudio = () => request('/dj/sublist')

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
    data: TrackSource[]
  }>('/personal_fm', { params: { timestamp: now() } })

/**
 * 私人fm 不喜欢
 */
export const fmToTrash = (id: number) => request('/fm_trash', { params: { id } })

/**
 * 获取推荐歌单（需要登录）
 * @returns {Promise<AxiosResponse<any>>}
 */
export const recommendPlaylist = () => request('/recommend/resource', { params: { timestamp: now() } })

/**
 * 用户日推歌曲
 * @returns
 */
export const getDailyRecommend = () =>
  request<{
    data: {
      dailySongs: TrackSource[]
      recommendReasons: []
    }
  }>('/recommend/songs')

/**
 * 获取喜欢列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getLikeList = () => request(`/likelist?timestamp=${now()}`)
