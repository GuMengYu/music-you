import { isArray, now } from 'lodash-es'

import { getProgramData, podcastPrograms } from '@/api/podcast'
import { QUALITY_LEVEL, useSettingStore } from '@/store/setting'
import { useUserStore } from '@/store/user'
import type { Album, Artist, MV, Playlist, Track } from '@/types'
import type { RESOURCE_TYPE } from '@/util/enum'
import { request } from '@/util/fetch'

import { getAlbum } from './album'
import { getArtist } from './artist'
import { getPlaylistDetail, getPlaylistTrackAll } from './playlist'
import { getLyric, getLyricNew, getSongData, getSongUrl, getSongUrlFromUnlockMusic } from './song'

/**
 * 获取歌曲详情，包括歌词、可供播放的url
 * @param id: 歌曲id
 * @param isProgram
 * @returns {Promise<{lyric: (*[]|*), url: string}>}
 */
export const getTrackDetail = async (id: number, isProgram = false) => {
  let track: Track | null = null
  let lyric = null
  if (isProgram) {
    const { program } = await getProgramData(id)
    const { id: programVoiceId } = program.mainSong
    track = program as unknown as Track
    track.id = programVoiceId
  } else {
    const {
      songs: [data],
    } = await getSongData([id])
    track = data
    lyric = await getLyricNew(id)
  }
  const trackMeta = await getMusicUrl(track)
  return { track, trackMeta, lyric }
}

/**
 * 获取歌单播放链接
 * @param id
 * @returns
 */
export const getMusicUrl = async (track: Track) => {
  const userStore = useUserStore()
  const settingStore = useSettingStore()
  const level = settingStore.quality_level ?? QUALITY_LEVEL.HIGHER
  const meta: Track['meta'] = {
    url: null,
    br: null,
    type: '',
    encodeType: '',
  }
  if (userStore.logged) {
    const {
      data: [song],
    } = await getSongUrl({ id: track.id, level })
    if (song?.freeTrialInfo || !song.url) {
      try {
        const result = await getSongUrlFromUnlockMusic(track) // 尝试解锁灰色或者试听歌曲
        meta.url = result.url ?? ''
        meta.sourceFromUnlockMusic = true
      } catch (e) {
        console.log(e)
        meta.url = null
      }
    } else {
      meta.url = song.url
      meta.br = song['br']
      meta.type = song['type']?.toUpperCase()
      meta.encodeType = song['encodeType']?.toUpperCase()
    }
  } else {
    meta.url = `https://music.163.com/song/media/outer/url?id=${track.id}`
  }
  return meta
}
export const search = (keywords = '', conditions = {}) => {
  return request<{
    result: {
      songs?: Track[]
      albums?: Album[]
      artists?: Artist[]
      mvs?: MV[]
      playlists?: Playlist[]
    }
  }>('/cloudsearch', {
    params: {
      keywords,
      ...conditions,
    },
  })
}

export const multiMatchSearch = (keywords = '') => {
  return request<{
    code: number
    result: {
      album: Album[]
      artist: Artist[]
      playlist: Playlist[]
      orders: Array<'artist' | 'album' | 'playlist'>
    }
  }>('/search/multimatch', {
    params: {
      keywords,
    },
  })
}

/**
 * 统一获取歌曲列表（从专辑，歌手，歌单）
 * @param type
 * @param id
 * @returns
 */
export const getTrackList = async (type: 'album' | 'playlist' | 'artist' | 'program', id: number) => {
  let res: { id: number; tracks: Track[]; name?: string }
  if (type === 'playlist') {
    const { playlist } = await getPlaylistDetail(id)
    const { songs } = await getPlaylistTrackAll(playlist)
    res = {
      id: playlist.id,
      name: playlist.name,
      tracks: songs,
    }
  } else if (type === 'album') {
    const { album, songs } = await getAlbum(id)
    res = {
      id: album.id,
      name: album.name,
      tracks: songs,
    }
  } else if (type === 'artist') {
    const { artist, hotSongs } = await getArtist(id)
    res = {
      id: artist.id,
      tracks: hotSongs,
    }
  } else {
    const { programs } = await podcastPrograms(id)
    res = {
      id,
      tracks: programs,
    }
  }
  return res
}

/**
 * 收藏|取消
 * @param type 类型： 歌曲, 歌单, 专辑, mv
 * @param id
 * @param t: 1 收藏 其他 取消收藏
 * 根据歌单id返回歌单详细信息
 */
export const sub = (type: 'album' | 'playlist' | 'artist' | 'mv' | 'track', id: Track['id'], t: number) => {
  const params: {
    timestamp: number
    id: string | number
    t?: number
    like?: boolean
  } = { timestamp: now(), id }
  const url = {
    album: '/album/sub',
    playlist: '/playlist/subscribe',
    mv: '/mv/sub',
    artist: '/artist/sub',
    track: '/like',
  }[type]
  Object.assign(params, { t })
  if (type === 'track') {
    delete params.t
    params.like = t === 1
  }
  return request<{
    code: number
    message: string
  }>(url, {
    params,
  })
}

/**
 * 资源点赞( MV,电台,视频)
 * @param type 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台节目 5: 视频 6: 动态 7: 电台
 * @param id 资源id
 * @param t 1 点赞 其他 取消点赞
 */
export const resourceLike = (type: RESOURCE_TYPE, id: number, t: 1 | 0) => {
  return request<{
    code: number
  }>('/resource/like', {
    params: {
      timestamp: now(),
      type,
      id,
      t,
    },
  })
}
export const start = (params: { id: number; content?: string }) => {
  return request('/startplay', {
    params: {
      content: params.content ?? '',
      id: params.id,
    },
  })
}

/**
 * 听歌打卡
 * 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
 * 必选参数 : id: 歌曲 id, sourceid: 歌单或专辑 id
 * 可选参数 : time: 歌曲播放时间,单位为秒
 * 接口地址 : /scrobble
 * 调用例子 : /scrobble?id=518066366&sourceid=36780169&time=291
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const end = (params: { id: number; sourceId: number | string; time: number; content?: string }) => {
  return request('/endplay', {
    params: {
      content: params.content,
      id: params.id,
      sourceId: params.sourceId,
      time: params.time,
      timestamp: now(),
    },
  })
}

/**
 * 对歌单添加或删除歌曲
 * @returns {*}
 * @param op : string 添加为add, 删除为 del
 * @param pid : number 歌单id
 * @param tracks : Array 歌曲id 可多个,用逗号隔开
 */
export const opPlaylist = (op: 'add' | 'del' = 'add', pid: number, trackId: number[] | number = []) => {
  return request<{
    code: number
    count: number
    cloudCount: number
    message?: string
  }>('/playlist/tracks', {
    params: {
      op,
      pid,
      tracks: isArray(trackId) ? trackId.join(',') : trackId,
      timestamp: now(),
    },
  })
}
