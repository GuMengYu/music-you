import { musicXhr } from '@util/xhr';

export const search = (params) => musicXhr.get('/wallhaven/search', { params });

export const tagInfo = (tagId) => musicXhr.get(`/wallhaven/tag/${tagId}`);

export const getHot = () => musicXhr.get('/wallhaven/index');

export const getWallpaper = (id) => musicXhr.get(`/wallhaven/get/${id}`);

export const getLatest = (page = 1) => {
  const params = {
    categories: 111,
    purity: 110,
    sorting: 'date_added',
    order: 'desc',
    page,
  };
  musicXhr.get('/wallhaven/search', { params });
};

export const getTopList = (page = 1) => {
  const params = {
    categories: 111,
    purity: 110,
    sorting: 'toplist',
    order: 'desc',
    page,
  };
  musicXhr.get('/wallhaven/search', { params });
};

export const getHotList = (page = 1) => {
  const params = {
    categories: 111,
    purity: 110,
    sorting: 'hot',
    order: 'desc',
    page,
  };
  musicXhr.get('/wallhaven/search', { params });
};

export const categories = {
  general: 'general',
  anime: 'anime',
  people: 'people',
};
export const purity = {
  sfw: 'sfw',
  nsfw: 'nsfw',
  sketchy: 'sketchy',
};

export const sortingOptions = {
  date_added: {
    title: '添加日期',
    val: 'date_added',
  },
  relevance: {
    title: '关联性',
    val: 'relevance',
  },
  random: {
    title: '随机',
    val: 'random',
  },
  views: {
    title: '浏览量',
    val: 'views',
  },
  favorites: {
    title: '收藏量',
    val: 'favorites',
  },
  toplist: {
    title: '排行榜',
    val: 'toplist',
  },
  hot: {
    title: '热度',
    val: 'hot',
  },
};

export const orderOptions = {
  desc: {
    title: 'desc',
    val: 'desc',
  },
  asc: {
    title: 'asc',
    val: 'asc',
  },
};

export const convertCategories = (cats = []) => {
  const toNumber = (t) => (cats.includes(t) ? '1' : '0');
  return `${toNumber(categories.general)}${toNumber(
    categories.anime,
  )}${toNumber(categories.people)}`;
};

export const convertPurity = (pur = []) => {
  const toNumber = (t) => (pur.includes(t) ? '1' : '0');
  return `${toNumber(purity.sfw)}${toNumber(purity.sketchy)}${toNumber(
    purity.nsfw,
  )}`;
};
