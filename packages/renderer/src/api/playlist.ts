import { now } from 'lodash-es'

import type { Playlist } from '@/types'
import { request, requestPost } from '@/util/fetch'

/**
 * 根据歌单id返回歌单详细信息
 * @param {number} id 歌单 id
 * @param {realTime=} realTime 是否实时获取
 * @returns {Promise<playListModel>}
 */

export const getPlaylistDetail = (id: number, realTime = false) => {
  const params: {
    id: number
    timestamp?: number
  } = { id }
  realTime && (params.timestamp = now())
  return request<{
    playlist: Playlist
    privileges: []
  }>('/playlist/detail', {
    params,
  })
}

/**
 * 获取相关歌单
 * @param id 歌单 id
 * @returns {Promise<relatePlayListModel[]>}
 */
export const getRelatedPlayList = (id: number) =>
  request<{
    playlists: Playlist[]
  }>(`/related/playlist`, { params: { id } })

/**
 * 删除歌单
 * @param id
 * @returns
 */
export const deletePlayList = (id: number) => {
  return request<{
    code: number
    message: string
  }>('/playlist/delete', {
    params: {
      id,
      timestamp: now(),
    },
  })
}

/**
 * 新建歌单
 * name 歌单名
 * privacy 是否设置为隐私歌单，默认否，'10' 为隐私歌单
 * type 歌单类型
 * @param {name: string, privacy: number, type: string} params
 * @returns
 */
export const createPlaylist = (params: { name: string; privacy: number; type: string }) =>
  requestPost('/playlist/create', {
    ...params,
    timestamp: now(),
  })

/**
 * 获取歌单分类列表
 * @returns
 */
export const getCatList = () =>
  request<{
    categories: Record<string, string>
    sub: []
  }>('/playlist/catlist')

/**
 * 获得歌单动态信息,如是否收藏,收藏数,评论数,分享数
 * @param id
 */
export const getPlayListDynamic = (id: number) =>
  request<{
    isSub: boolean
    subCount: number
  }>('/playlist/detail/dynamic', {
    params: {
      timestamp: now(),
      id,
    },
  })
