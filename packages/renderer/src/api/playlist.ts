import { now } from 'lodash-es'

import type { Playlist } from '@/types'
import { request } from '@/util/fetch'

interface playListModel {
  playlist: Playlist
  privileges: []
}
/**
 * 根据歌单id返回歌单详细信息
 * @param {number} id 歌单 id
 * @param {realTime=} realTime 是否实时获取
 * @returns {Promise<playListModel>}
 */

export const getPlaylistDetail = (id: number, realTime = false) =>
  request<playListModel>('/playlist/detail', {
    params: {
      id,
      timestamp: realTime ? now() : undefined,
    },
  })

interface relatePlayListModel {
  playlists: Playlist[]
}
/**
 * 获取相关歌单
 * @param id 歌单 id
 * @returns {Promise<relatePlayListModel[]>}
 */
export const getRelatedPlayList = (id: number) => request<relatePlayListModel>(`/related/playlist`, { params: { id } })
