import { now } from 'lodash-es'

import type { Track } from '@/types'
import { request, requestPost } from '@/util/fetch'

export const cloudDiskMusicList = (params = { limit: 50, offset: 0 }) => {
  return request<{
    data: {
      simpleSong: Track
    }[]
  }>('/user/cloud', { params: { ...params, timestamp: now() } })
}

export const deleteCloudDiskMusic = (id: number) => {
  return request('/user/cloud/del', { params: { id: id } })
}

export const cloudDiskDetail = (id: number) => {
  return request('/user/cloud/detail', { params: { id: id } })
}

export const uploadMusicToCloudDisk = (data: { file: File }) => {
  return requestPost('/cloud', {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
    params: {
      timestamp: now(),
    },
  })
}
