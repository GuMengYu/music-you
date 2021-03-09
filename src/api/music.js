import { getLyric, getSongData, getSongUrl, getSongUrlFromUnlockMusic } from '@/api/index'

/**
 * 获取歌曲详情，包括歌词、可供播放的url
 * @param id: 歌曲id
 * @param logged: 用户是否登录（决定播放url）
 * @returns {Promise<{lyric: (*[]|*), url: string}>}
 */
export const getTrackDetail = async (id, logged = false) => {
  const { songs: [track] } = await getSongData([id]);
  const {lrc, nolyric, uncollected} = await getLyric(id);
  const lyric = (uncollected || nolyric) ? [] : lrc.lyric?.split('\n').map(i => {
    const [time, sentence] = i.split(']');
    return {time, sentence};
  });
  let url;
  if (logged) {
    const { data: [song] } = await getSongUrl(id);
    if (song?.freeTrialInfo || !song.url) {
      const { data } = await getSongUrlFromUnlockMusic(id); // 尝试解锁灰色或者试听歌曲
      url = data?.url;
    } else {
      url = song.url;
    }
  } else {
    url = `https://music.163.com/song/media/outer/url?id=${id}`
  }
  return {...track, url, lyric};
}
