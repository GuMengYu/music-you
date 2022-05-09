import { now } from 'lodash-es'

import { musicXhr as xhr, xhrGet } from '../util/xhr'

/**
 * 获取推荐歌单列表
 * @param limit 返回限制
 * @returns {Promise<{result: Playlist[]}>}
 */
export const personalizedPlaylist = (limit: number) => {
  return xhrGet<{ result: [] }>('/personalized', { params: { limit, timestamp: now() } })
}

export const fetchPlaylist = (limit: number) =>
  fetch(`/api/personalized?limit=${limit}&timestamp=${now()}`, {
    method: 'get',
    credentials: 'include',
  })
/**
 * 获取推荐MV
 * @returns {Promise<AxiosResponse<any>>}
 */
export const personalizedMV = () => xhr.get('/personalized/mv')

/**
 * 推荐新歌曲
 */
export const personalizedSong = (limit: number) => xhr.get('/personalized/newsong', { params: { limit } })
