import { now } from 'lodash-es'

import type { MV } from '@/types'
import { request } from '@/util/fetch'
/**
 * 获取热门视频
 * @param offset
 * @returns {*}
 */
export const recommendVideo = (offset) => request('/video/timeline/recommend', { offset })

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
export const mvDetail = (mvid) => {
  return request('/mv/detail', {
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
export const getMvUrl = (params) => {
  return request('/mv/url', {
    params,
  })
}

/**
 * 相似 mv
 * 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
 * @param {number} mvid
 */
export const simiMv = (mvid) => {
  return request('/simi/mv', {
    params: {
      mvid,
    },
  })
}
