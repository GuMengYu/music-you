import { musicXhr as xhr } from './xhr';

/**
 * 获取歌曲详情
 * @param ids[]
 * 根据歌曲id返回歌曲详细信息
 */
const getSongData = (ids = []) => xhr.get(`/song/detail?ids=${ids.join()}`);
/**
 * 获取歌曲可播放url
 * @param id
 * 根据歌曲id返回歌曲详细信息
 */
const getSongUrl = id => xhr.get(`/song/url?id=${id}`);

/**
 * 获取歌单详情
 * @param id
 * 根据歌单id返回歌单详细信息
 */
const getPlayList = id => xhr.get(`/playlist/detail?id=${id}`);
/**
 * 获取推荐歌单列表
 * 根据歌单id返回歌单详细信息
 */
const getPersonalized = () => xhr.get('/personalized');

const getLyric = id => xhr.get(`/lyric?id=${id}`);
export {
  getSongData,
  getSongUrl,
  getPlayList,
  getPersonalized,
  getLyric,
};
