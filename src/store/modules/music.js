import {getLyric, getSongData} from '@util/musicService';
import {Message} from '@/plugins/snackbar';
export default {
  namespaced: true,
  state: {
    playing: false,
    musicUrl: '',
    song: {},
    currentTime: 0,
    pendingList: [],
    showList: false,
  },
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
    UPDATE_PENDING_LIST(state, list) {
      state.pendingList = list;
    },
    UPDATE_SONG(state, song) {
      state.song = song;
    },
    UPDATE_PLAYER(state, payload) {
      Object.keys(payload).map(key => {
        state[key] = payload[key];
      });
    },
    UPDATE_WAIT_LIST(state, showList = false) {
      state.showList = showList;
    },
  },
};
