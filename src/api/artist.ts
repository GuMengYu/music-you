import { now } from 'lodash-es'

import type { Album, Artist, MV, Track } from '@/types'
import { request } from '@/util/fetch'

/**
 * 获取歌手信息、热门歌曲
 * @param id
 * @returns
 */
export const getArtist = (id: number) =>
  request<{
    artist: Artist
    hotSongs: Track[]
  }>(`/artists?id=${id}&timestamp=${now()}`)

/**
 * 获取歌手详情
 * @param id
 * @returns
 */
export const getArtistDetail = (id: number) =>
  request<{
    data: {
      artist: Artist
    }
  }>(`/artist/detail?id=${id}`)

/**
 * 获取相似歌手
 * @param id
 * @returns
 */
export const getSimiArtist = (id: number) =>
  request<{
    artists: Artist[]
  }>(`/simi/artist?id=${id}`)

/**
 * 获取歌手专辑
 * @param id
 * @param limit
 * @returns
 */
export const getArtistAlbum = (id: number, limit = 100) =>
  request<{
    artist: Artist
    hotAlbums: Album[]
  }>('/artist/album', {
    params: {
      id,
      limit,
    },
  })

/**
 * 获取歌手mv
 * @param id
 * @returns
 */
export const getArtistMv = (id: number) =>
  request<{
    hasMore: boolean
    mvs: MV[]
  }>('/artist/mv', {
    params: { id },
  })
