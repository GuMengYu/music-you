import { now } from 'lodash-es'

import type { Artist, MV } from '@/types'
import { request } from '@/util/fetch'
/**
 * 获取热门视频
 * @param offset
 * @returns {*}
 */
export const recommendVideo = (offset: number) => request('/video/timeline/recommend', { params: { offset } })

/**
 * 获取新mv
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getNewMv = (params?: { limit?: number }) =>
  request<{
    data: MV[]
  }>('/mv/first', { params })

/**
 * 获取 mv 数据
 * @param mvid
 * @returns {Promise<AxiosResponse<any>>}
 */
interface mvDetailModel {
  name: string
  cover: string
  artists: Artist[]
  artistName: string
  artistId: number
  briefDesc: string
}
export const mvDetail = (mvid: number) => {
  return request<{
    data: MV
    subed: boolean
  }>('/mv/detail', {
    params: {
      mvid,
      timestamp: now(),
    },
  })
}

/**
 * mv 地址
 * 说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
 * - id: mv id
 * @param {Object} params
 * @param {number} params.id
 * @param {number=} params.r
 */
export const getMvUrl = (params: { id: number; r: number }) => {
  return request<{
    data: {
      url: string
      size: number
      id: number
      r: number
    }
  }>('/mv/url', {
    params,
  })
}

/**
 * 相似 mv
 * 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
 * @param {number} mvid
 */
export const simiMv = (mvid: number) => {
  return request<{
    mvs: MV[]
  }>('/simi/mv', {
    params: {
      mvid,
    },
  })
}

/**
 * 获取MV评论
 * @param id
 * @param limit
 * @param offset
 * @returns
 */
export const getMVComment = (id: number, limit = 20, offset = 0) => {
  return request<{
    code: number
    total: number
    comments: []
    hotComments: []
    more: boolean
    hotMore: boolean
  }>('/comment/mv', { params: { id, limit, offset } })
}
