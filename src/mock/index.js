const Mock = require('mockjs');

import {musicDetail, songUrl, songLrc} from '@/mock/music/music';
import recommendPlayList from '@/mock/music/playlist-recommend.json';
import playlist from '@/mock/music/playlist.json';

Mock.mock(/song\/detail/, musicDetail);
Mock.mock(/song\/url/, songUrl);
Mock.mock(/playlist\/detail/, () => playlist);
Mock.mock(/personalized/, () => recommendPlayList);
Mock.mock(/lyric/, songLrc);


