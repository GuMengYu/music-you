import { now } from 'lodash-es'

import type { Playlist, Track } from '@/types'
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
 * 获取歌单所有歌曲
 * @param id 歌单 id
 * @param limit 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * @param offset 默认值为0
 * @returns Playlist
 */
export const getPlaylistTrackAll = (playlist: Playlist, limit?: number, offset = 0) => {
  const params: {
    id: number
    limit?: number
    offset?: number
    timestamp?: number
  } = { id: playlist.id, offset }
  params.limit = limit ?? playlist.trackIds.length >= 1000 ? 1000 : playlist.trackIds.length
  return request<{
    songs: Track[]
    privileges: []
  }>('/playlist/track/all', {
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
 * 更新歌单信息
 * @param id 歌单id
 * @param name 歌单名字
 * @param desc 歌单描述
 * @param tags 歌单tag ,多个用 `;` 隔开,只能用官方规定标签
 * @returns
 */
export const updatePlaylist = (id: number, name: string, desc: string, tags: string[]) => {
  return request<{
    code: number
  }>('/playlist/update', {
    params: {
      id,
      name,
      desc,
      tags,
      timestamp: now(),
    },
  })
}

export const updatePlayListCover = (
  id: number,
  formdata: FormData,
  options: {
    imgX: number
    imgY: number
  }
) => {
  return requestPost('/playlist/cover/update', formdata, {
    params: {
      id,
      imgX: options.imgX,
      imgY: options.imgY,
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
export const createPlaylist = (params: { name: string; privacy: number }) =>
  requestPost(
    '/playlist/create',
    {
      ...params,
    },
    {
      params: {
        timestamp: now(),
      },
    }
  )

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
/**
 * 获取歌单评论
 * @param id
 * @param limit
 * @param offset
 * @returns
 */
export const getPlayListComment = (id: number, limit = 15, offset = 0) => {
  return request<{
    code: number
    total: number
    comments: []
    hotComments: []
    more: boolean
    hotMore: boolean
  }>('/comment/playlist', { params: { id, limit, offset } })
}
