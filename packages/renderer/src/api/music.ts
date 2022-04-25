import { now } from 'lodash-es'

import { useAppStore } from '../store/app'
import {
  getAlbum,
  getArtist,
  getLyric,
  getPlayList,
  getSongData,
  getSongUrl,
  getSongUrlFromUnlockMusic,
} from './index'
import { RADARPLAYLISTS } from '../util/metadata'
import { musicXhr as xhr } from '../util/xhr'

/**
 * 获取歌曲详情，包括歌词、可供播放的url
 * @param id: 歌曲id
 * @param br: 码率
 * @returns {Promise<{lyric: (*[]|*), url: string}>}
 */
export const getTrackDetail = async (id: string | number, br = 320000) => {
  const {
    songs: [track],
  } = await getSongData([id])
  const lyric = await getLyric(id)
  const url = await getMusicUrl(id, br)
  return { ...track, url, lyric }
}

export const getMusicUrl = async (id, br = 320000) => {
  const logged = useAppStore().logged
  let url
  if (logged) {
    const {
      data: [song],
    } = await getSongUrl({ id, br })
    if (song?.freeTrialInfo || !song.url) {
      try {
        const { data } = await getSongUrlFromUnlockMusic(id) // 尝试解锁灰色或者试听歌曲
        url = data?.url
      } catch (e) {
        console.log(e)
        url = null
      }
    } else {
      url = song.url
    }
  } else {
    url = `https://music.163.com/song/media/outer/url?id=${id}`
  }
  return url
}
export const search = (keywords = '', conditions) => {
  return xhr.get('/cloudsearch', {
    params: {
      keywords,
      ...conditions,
    },
  })
}

export const multiSearch = (keywords) => {
  return xhr.get('/search/multimatch', {
    params: { keywords },
  })
}

export const getList = async (type, id) => {
  const service = {
    album: getAlbum,
    playlist: getPlayList,
    artist: getArtist,
  }[type]
  const data = await service(id)
  let res = {}
  if (type === 'album') {
    res = data
  } else if (type === 'playlist') {
    res = data?.playlist
  } else {
    res = data
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
export const sub = (type, id, t) => {
  const params = { timestamp: now() }
  const url = {
    album: '/album/sub',
    playlist: '/playlist/subscribe',
    mv: '/mv/sub',
    artist: '/artist/sub',
    track: '/like',
  }[type]
  Object.assign(params, { id, t })
  if (type === 'track') {
    delete params.t
    params.like = t === 1
  }
  return xhr.get(url, {
    params,
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
export const scrobble = (params) => {
  params.timestamp = now()
  return xhr.get('/scrobble', {
    params,
  })
}

/**
 * 对歌单添加或删除歌曲
 * @returns {*}
 * @param op : string 添加为add, 删除为 del
 * @param pid : number 歌单id
 * @param tracks : Array 歌曲id 可多个,用逗号隔开
 */
export const doPlaylist = (op = 'add', pid, tracks = []) => {
  return xhr.get('/playlist/tracks', {
    params: {
      op,
      pid,
      tracks: tracks.join(','),
      timestamp: now(),
    },
  })
}

export async function getRadarList() {
  const list = RADARPLAYLISTS.map((playlist) => {
    return getPlayList(playlist.id)
  })
  const result = await Promise.all(list)
  return result.map((i) => i.playlist)
}
