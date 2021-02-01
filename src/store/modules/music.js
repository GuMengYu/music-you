import {getLyric, getSongData} from '@util/musicService';
import {Message} from '@/plugins/snackbar';
import {make} from 'vuex-pathify';
const state = {
  playing: false,
  musicUrl: '',
  song: {
    name: 'That\'s the way it is',
    ar: [{
      name: 'Daniel Lanois',
    }],
    al: {
      picUrl: 'http://p4.music.126.net/OT5j1j9SBwcoay4G2VP5Wg==/109951164153921681.jpg?param=100y100',
    },
  },
  currentTime: 0,
  playingList: [],
  showList: false,
  showLyricsPage: false,
};
export default {
  namespaced: true,
  state,
  getters: {

  },
  actions: {
    async startNewMusic({ commit }, id) {
      commit('UPDATE_PLAYER', {playing: false, currentTime: 0});
      const [song, lyric] = await Promise.all([getSongData([id]).then(res => res.songs?.[0] ?? {}), getLyric(id).then(result => {
        const {lrc, uncollected} = result;
        return uncollected ? [] : lrc.lyric?.split('\n').map(i => {
          const [time, sentence] = i.split(']');
          return {time, sentence};
        });
      })]);
      if (!song) {
        Message.error('加载歌曲失败');
      } else {
        commit('UPDATE_SONG', {lyric, ...song});
        commit('UPDATE_PLAYER', {
          musicUrl:  `https://music.163.com/song/media/outer/url?id=${id}.mp3`,
        });
      }
    },
  },
  mutations: {
    ...make.mutations(state),
    UPDATE_PLAYING_LIST(state, list) {
      state.playingList = list;
    },
    UPDATE_SONG(state, song) {
      state.song = song;
    },
    UPDATE_PLAYER(state, payload) {
      Object.keys(payload).map(key => {
        state[key] = payload[key];
      });
    },
  },
};
