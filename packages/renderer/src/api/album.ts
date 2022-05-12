import { now } from 'lodash-es'

import type { Album, TrackSource } from '@/types'
import { request } from '@/util/fetch'

/**
 * 获取专辑详情
 * @param {number} id
 * 根据专辑id返回专辑详细信息
 * @returns {Promise<Album>}
 */

export const getAlbum = (id: number) =>
  request<{
    album: Album
    songs: TrackSource[]
    resourceState: boolean
  }>('/album', { params: { id } })

/**
 * 获取新专辑
 */
export const newAlbums = (params: { limit: number; area: string }) => {
  return request('/album/new', {
    params,
  })
}
/**
 * 获得歌单动态信息,如是否收藏,收藏数,评论数,分享数
 * @param id
 */
export const getPlayListDynamic = (id: number) =>
  request('/playlist/detail/dynamic', {
    params: {
      timestamp: now(),
      id,
    },
  })
