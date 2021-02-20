import queryString from 'querystring';
const Mock = require('mockjs');

import {musicDetail, songUrl, songLrc} from '@/mock/music/music';
import recommendPlayList from '@/mock/music/playlist-recommend.json';
import playlist from '@/mock/music/playlist.json';
import artists from '@/mock/music/artists.json';
import login from '@/mock/music/login.json';
import artist from '@/mock/music/artist.json'
import artistAlbum from '@/mock/music/artistAlbum.json';
import banner from '@/mock/music/banner.json';
import hotPlaylist from '@/mock/music/hotPlaylist.json'
import toplist from '@/mock/music/toplist.json';
import newrelease from '@/mock/music/newrelease.json';
Mock.mock(/song\/detail/, musicDetail);
Mock.mock(/song\/url/, songUrl);
Mock.mock(/playlist\/detail/, ({url}) => {
  const { id } = queryString.parse(url.split('?')[1]);
  return playlist.find(item => item.id == id) || {
    'id': 119215665,
    'code': 200,
    'playlist': {
      tracks: [],
    },
  };
});
Mock.mock(/personalized/, () => recommendPlayList);
Mock.mock(/lyric/, songLrc);
Mock.mock(/toplist\/artist/, () => artists);
Mock.mock(/login/, () => login);

Mock.mock(/artists\?id=/, () => artist);
Mock.mock(/artist\/album\?id=/, () => artistAlbum);

Mock.mock(/banner/, banner);
Mock.mock(/top\/playlist/, hotPlaylist);
Mock.mock(/toplist/, toplist);
Mock.mock(/top\/song/, newrelease);
