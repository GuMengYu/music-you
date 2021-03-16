import {musicXhr as xhr} from '@/util/xhr'
import { getLyric, getSongData, getSongUrl, getSongUrlFromUnlockMusic } from '@/api/index'
/**
 * 获取歌曲详情，包括歌词、可供播放的url
 * @param id: 歌曲id
 * @param br: 码率
 * @param logged: 用户是否登录（决定播放url）
 * @returns {Promise<{lyric: (*[]|*), url: string}>}
 */
export const getTrackDetail = async (id, br = 320000, logged = false) => {
  const { songs: [track] } = await getSongData([id]);
  const lyric = await getLyric(id);
  let url;
  if (logged) {
    const { data: [song] } = await getSongUrl({ id, br  });
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
    url = `https://music.163.com/song/media/outer/url?id=${id}`
  }
  return {...track, url, lyric};
}

export const search = async (keywords, conditions) => {
  return xhr.get('/cloudsearch', {
    params: {
      keywords,
      ...conditions,
    },
  })
}
