import { request } from '@/util/fetch'
/**
 * 获取歌曲详情
 * @param ids[]
 * 根据歌曲id返回歌曲详细信息
 */
export const getSongData = (ids = []) => request(`/song/detail?ids=${ids.join()}`)
/**
 * 获取歌曲可播放url
 * @param params
 * 根据歌曲id返回歌曲详细信息
 */
export const getSongUrl = (params: { id: string; br: number }) =>
  request('/song/url', {
    params,
  })

/**
 * 获取歌曲下载链接
 * @param params
 */
export const getSongDownloadUrl = (params: { id: string; br: number }) => {
  return request('/song/download/url', {
    params,
  })
}

/**
 * 解锁灰色不可播放歌曲
 * @param id
 */
export const getSongUrlFromUnlockMusic = (id) => request('/unlockmusic', { params: { id }, timeout: 4000 })

/**
 * 获取歌词
 * @param id
 * @returns
 */
export const getLyric = (id) => request(`/lyric?id=${id}`)
