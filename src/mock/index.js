import queryString from 'querystring';
const Mock = require('mockjs');

import {musicDetail, songUrl, songLrc} from '@/mock/music/music';
import recommendPlayList from '@/mock/music/playlist-recommend.json';
import playlist from '@/mock/music/playlist.json';

Mock.mock(/song\/detail/, musicDetail);
Mock.mock(/song\/url/, songUrl);
Mock.mock(/playlist\/detail/, ({url}) => {
  const { id } = queryString.parse(url.split('?')[1]);
  return playlist.find(item => item.id == id);
});
Mock.mock(/personalized/, () => recommendPlayList);
Mock.mock(/lyric/, songLrc);


