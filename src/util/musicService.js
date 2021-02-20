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
 * banner
 * 返回轮播图信息
 */
export const getBanner = () => {
  return xhr.get('/banner');
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
/**
 * 获取网友精选碟歌单
 * 可选参数 : order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 cat:cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 limit: 取出歌单数量 , 默认为 50
 offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export const getTopPlaylist = (param = {limit:20, cat: '全部', offset: 0}) => xhr.get(`/top/playlist?cat=${param.cat}&limit=20&offset=${param.offset}`);

/**
 * 获取新歌
 */
export const getNewRelease = () => xhr.get('/top/song').then(res => {
  return res.data?.[2];
});

/**
 * 获取所有榜单
 */
export const getToplist = () => xhr.get('/toplist');

export const getLyric = id => xhr.get(`/lyric?id=${id}`);

export const getArtist = id => xhr.get(`/artists?id=${id}`);

export const getArtistAlbum = id => xhr.get(`/artist/album?id=${id}`);
