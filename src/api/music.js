import { musicXhr as xhr } from '@/util/xhr';
import {
  getLyric,
  getSongData,
  getSongUrl,
  getSongUrlFromUnlockMusic,
  getPlayList,
  getAlbum,
  getArtist,
} from '@/api/index';
import { now } from 'lodash-es';
/**
 * 获取歌曲详情，包括歌词、可供播放的url
 * @param id: 歌曲id
 * @param br: 码率
 * @param logged: 用户是否登录（决定播放url）
 * @returns {Promise<{lyric: (*[]|*), url: string}>}
 */
export const getTrackDetail = async (id, br, logged) => {
  const {
    songs: [track],
  } = await getSongData([id]);
  const lyric = await getLyric(id);
  const url = await getMusicUrl(id, br, logged);
  return { ...track, url, lyric };
};

export const getMusicUrl = async (id, br = 320000, logged = false) => {
  let url;
  if (logged) {
    const {
      data: [song],
    } = await getSongUrl({ id, br });
    if (song?.freeTrialInfo || !song.url) {
      try {
        const { data } = await getSongUrlFromUnlockMusic(id); // 尝试解锁灰色或者试听歌曲
        url = data?.url;
      } catch (e) {
        console.log(e);
        url = null;
      }
    } else {
      url = song.url;
    }
  } else {
    url = `https://music.163.com/song/media/outer/url?id=${id}`;
  }
  return url;
};
export const search = (keywords, conditions) => {
  return xhr.get('/cloudsearch', {
    params: {
      keywords,
      ...conditions,
    },
  });
};

export const getList = async (type, id) => {
  const service = {
    album: getAlbum,
    playlist: getPlayList,
    artist: getArtist,
  }[type];
  const data = await service(id);
  let list = [];
  if (type === 'album') {
    list = data.songs;
  } else if (type === 'playlist') {
    list = data?.playlist?.tracks;
  } else {
    list = data.list;
  }
  return list;
};

/**
 * 收藏|取消
 * @param type 类型： 歌曲, 歌单, 专辑, mv
 * @param id
 * @param t: 1 收藏 其他 取消收藏
 * 根据歌单id返回歌单详细信息
 */
export const sub = (type, id, t) => {
  let params = { timestamp: now() };
  let url = {
    album: '/album/sub',
    playlist: '/playlist/subscribe',
    mv: '/mv/sub',
    artist: '/artist/sub',
    track: '/like',
  }[type];
  Object.assign(params, { id, t });
  if (type === 'track') {
    delete params.t;
    params.like = t === 1;
  }
  return xhr.get(url, {
    params,
  });
};

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
  params.timestamp = now();
  return xhr.get('/scrobble', {
    params,
  });
};
