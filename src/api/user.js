import { musicXhr as xhr } from '@/util/xhr';

export const getUserPlaylist = params => {
  return xhr.get('/user/playlist', {
    params,
  })
}

