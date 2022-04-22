import { now } from 'lodash-es'

import { musicXhr as xhr } from '@/util/xhr'

/**
 * 获取最近播放
 * @param limit
 * @param type
 * @returns {Promise<AxiosResponse<any>>}
 */
export const recent = (limit = 50, type = 'song') => {
  return xhr.get(`/record/recent/${type}`, {
    params: {
      limit,
      timestamp: now(),
    },
  })
}
