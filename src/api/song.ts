import { ipcRenderer } from 'electron'

import type { QUALITY_LEVEL } from '@/store/setting'
import { useSettingStore } from '@/store/setting'
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
export const getSongUrl = (params: { id: number; level: QUALITY_LEVEL }) =>
  request<{
    data: {
      freeTrialInfo: boolean
      url: string
      br: number
      type: string
      encodeType: string
    }[]
  }>('/song/url/v1', {
    params,
  })

/**
 * 获取歌曲下载链接
 * @param params
 */
export const getSongDownloadUrl = (params: { id: number; br?: number }) => {
  return request<{
    data: {
      id: Track['id']
      url: string
      type: string
    }
    code: number
  }>('/song/download/url', {
    params,
  })
}

/**
 * 解锁灰色不可播放歌曲
 * @param track
 */
export const getSongUrlFromUnlockMusic = async (track: Track) => {
  const settingStore = useSettingStore()
  if (settingStore.unlock.unblockNetEaseMusic.open) {
    try {
      const { data, code } = await request<{
        data: {
          url: string
        }
        code: number
      }>('/unlockmusic', { params: { id: track.id, source: settingStore.unlock.unblockNetEaseMusic.source } })
      if (code === 200) {
        return data
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (settingStore.unlock.youtube.open) {
    try {
      return await ipcRenderer.invoke('getTrackFromYoutube', track.ar?.[0].name, track.name)
    } catch (e) {
      console.log(e)
    }
  }
  return {
    url: null,
  }
}

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

/**
 * 获取歌词，逐字歌词
 * @param id
 */
export const getLyricNew = (id: number) =>
  request<{
    briefDesc: string
    lrc: Lyric
    klyric: Lyric
    tlyric: Lyric
    lyricUser: LyricUser
    transUser: LyricUser
  }>(`/lyric/new?id=${id}`)

/**
 * 获取歌曲评论
 * @param id
 * @param limit
 * @param offset
 * @returns
 */
export const getMusicComment = (id: number, limit = 15, offset = 0) => {
  return request<{
    code: number
    total: number
    comments: []
    hotComments: []
    more: boolean
    hotMore: boolean
  }>('/comment/music', { params: { id, limit, offset } })
}
