import axios from 'axios'
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
  return request<{
    code: number
    message: string
  }>('/user/cloud/del', { params: { id: id } })
}

export const cloudDiskDetail = (id: number) => {
  return request('/user/cloud/detail', { params: { id: id } })
}

export const uploadMusicToCloudDisk = (file: File, config?: any) => {
  const formData = new FormData()
  formData.append('songFile', file)
  return axios({
    method: 'post',
    url: `/api/cloud`,
    data: formData,
    params: {
      timestamp: now(),
    },
    ...config,
  })
  // return requestPost('/cloud', formData, {
  //   params: {
  //     timestamp: now(),
  //   },
  // })
}
