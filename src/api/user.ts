import { now } from 'lodash-es'

import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Playlist, Podcast, Track } from '@/types'
import { request } from '@/util/fetch'

/**
 * 获取用户收藏歌单
 * @param params
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
 */
export const favAlbums = (offset = 0) =>
  request<{
    code: number
    data: Album[]
    count: number
    hasMore: boolean
  }>('/album/sublist', { params: { timestamp: now(), offset, limit: 20 } })

/**
 * 获取收藏的MV
 */
export const favMVs = (offset = 0) =>
  request<{
    count: number
    hasMore: boolean
    data: MV[]
  }>('/mv/sublist', { params: { timestamp: now(), offset, limit: 20 } })
/**
 * 获取收藏的歌手
 */
export const favArtists = (offset = 0) =>
  request<{
    count: number
    hasMore: boolean
    data: Artist[]
  }>('/artist/sublist', { params: { timestamp: now(), offset, limit: 20 } })

export const favPodcast = (offset = 0) =>
  request<{
    count: number
    hasMore: boolean
    djRadios: Podcast[]
  }>('/dj/sublist', { params: { timestamp: now(), offset, limit: 20 } })
/**
 * 获取最近播放
 * @param limit
 * @param type
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
export const recommendPlaylist = () =>
  request<{
    recommend: Playlist[]
    featureFirst: boolean
  }>('/recommend/resource', { params: { timestamp: now() } })

/**
 * 日推-不喜欢
 */
export const dailyRecommendDislike = (id: number) =>
  request<{
    code: number
    data: Track
    message: string
  }>('/recommend/dislike', { params: { timestamp: now(), id } })

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
  }>('/recommend/songs', { params: { timestamp: now() } })

/**
 * 获取喜欢列表
 */
export const getLikeList = () =>
  request<{
    ids: number[]
    code: number
  }>(`/likelist?timestamp=${now()}`)

export const getHeartBeatList = async (id: number) => {
  const userStore = useUserStore()
  const pid = userStore.favorites.id
  const res = await request<{
    code: number
    data: Array<{
      id: number
      songInfo: Track
      recommended: boolean
    }>
  }>('/playmode/intelligence/list', {
    params: {
      id,
      pid,
    },
  })
  if (res.code === 200) {
    return res.data.map((i) => i.songInfo)
  } else {
    return []
  }
}

export interface PlayRecord {
  playCount: number
  score: number
  song: Track
}

/**
 * 获取听歌排行
 */
export const fetchPlayRecord = async () => {
  const userStore = useUserStore()
  const fetch = (type = 0) =>
    request<{
      code: number
      weekData?: Array<PlayRecord>
      allData?: Array<PlayRecord>
    }>('/user/record', {
      params: {
        uid: userStore.uid,
        timestamp: now(),
        type,
      },
    })
  const [weekData, allData] = await Promise.all([fetch(1), fetch(0)])
  return {
    weekData: weekData.weekData ?? [],
    allData: allData.allData ?? [],
  }
}
