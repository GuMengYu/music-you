import type { Track } from '@/types'
import { request } from '@/util/fetch'
/**
 * 获取歌曲详情
 * @param ids[]
 * 根据歌曲id返回歌曲详细信息
 */
export const getSongData = (ids: number[] = []) =>
  request<{
    songs: Track[]
  }>(`/song/detail?ids=${ids.join()}`)
/**
 * 获取歌曲可播放url
 * @param params
 * 根据歌曲id返回歌曲详细信息
 */
export const getSongUrl = (params: { id: number; br: number }) =>
  request<{
    data: {
      freeTrialInfo: boolean
      url: string
    }[]
  }>('/song/url', {
    params,
  })

/**
 * 获取歌曲下载链接
 * @param params
 */
export const getSongDownloadUrl = (params: { id: string; br: number }) => {
  return request<{
    data: []
  }>('/song/download/url', {
    params,
  })
}

/**
 * 解锁灰色不可播放歌曲
 * @param id
 */
export const getSongUrlFromUnlockMusic = (id: number) =>
  request<{
    data: {
      url: string
    }
  }>('/unlockmusic', { params: { id } })

interface LyricUser {
  nickname: string
  userid: number
}
interface Lyric {
  lyric: string
  version: number
}
/**
 * 获取歌词
 * @param id
 * @returns
 */
export const getLyric = (id: number) =>
  request<{
    briefDesc: string
    lrc: Lyric
    klyric: Lyric
    tlyric: Lyric
    lyricUser: LyricUser
    transUser: LyricUser
  }>(`/lyric?id=${id}`)
