import { now } from 'lodash-es'

import { musicXhr as xhr } from '../util/xhr'

export const cloudDiskMusicList = (params = { limit: 50, offset: 0 }) => {
  return xhr.get('/user/cloud', { params: { ...params, timestamp: now() } })
}

export const deleteCloudDiskMusic = (id) => {
  return xhr.get('/user/cloud/del', { params: { id: id } })
}

export const cloudDiskDetail = (id) => {
  return xhr.get('/user/cloud/detail', { params: { id: id } })
}

export const uploadMusicToCloudDisk = (data) => {
  return xhr.post('/cloud', {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
    params: {
      timestamp: now(),
    },
  })
}
