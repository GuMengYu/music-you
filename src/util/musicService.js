import { musicXhr as xhr } from './xhr';

/**
 * 登录
 * - phone: 手机号
 * - md5_password: md5加密密码
 * @param {Object} params: {
 *   phone: String,
 *   md5_password: String
 * }
 */
export const login = params => {
  return xhr.post('/login/cellphone', params);
}
/**
 * 获取歌曲详情
 * @param ids[]
 * 根据歌曲id返回歌曲详细信息
 */
export const getSongData = (ids = []) => xhr.get(`/song/detail?ids=${ids.join()}`);
/**
 * 获取歌曲可播放url
 * @param id
 * 根据歌曲id返回歌曲详细信息
 */
export const getSongUrl = id => xhr.get(`/song/url?id=${id}`);

/**
 * 获取歌单详情
 * @param id
 * 根据歌单id返回歌单详细信息
 */
export const getPlayList = id => xhr.get(`/playlist/detail?id=${id}`);
/**
 * 获取推荐歌单列表
 * 根据歌单id返回歌单详细信息
 */
export const getPersonalized = () => xhr.get('/personalized?limit=10');
export const topArtists = () => xhr.get('/toplist/artist?type=2');

export const getLyric = id => xhr.get(`/lyric?id=${id}`);
