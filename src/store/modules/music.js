import {getLyric, getSongData} from '@util/musicService';
import {make} from 'vuex-pathify';
const state = {
  playing: false,
  track: JSON.parse(localStorage.getItem('song')) || [],
  currentTime: localStorage.getItem('currentTime') || 0,
  playingList: JSON.parse(localStorage.getItem('playingList')) || [],
  showList: false,
  showLyricsPage: false,
};
export default {
  namespaced: true,
  state,
  getters: {

  },
  actions: {
    fetch() {

    },
    updatePlayingList({commit}, list) {
      localStorage.setItem('playingList', JSON.stringify(list));
      commit('playingList', list);
    },
    async updateTrack({commit}, id) {
      commit('playing', false);
      commit('currentTime', 0);
      const [song, lyric] = await Promise.all([getSongData([id]).then(res => res.songs?.[0] ?? {}), getLyric(id).then(result => {
        const {lrc, uncollected} = result;
        return uncollected ? [] : lrc.lyric?.split('\n').map(i => {
          const [time, sentence] = i.split(']');
          return {time, sentence};
        });
      })]);
      if (!song) {
        commit('snackbar', {snackbar: {}, value: true});
      } else {
        const _song = {lyric, ...{...song, url: `https://music.163.com/song/media/outer/url?id=${id}.mp3`}}
        commit('track', _song);
        commit('playing', true);
        localStorage.setItem('song', JSON.stringify(_song));
      }
    },
  },
  mutations: {
    ...make.mutations(state),
    playingList(state, list) {
      state.playingList = list;
    },
    UPDATE_PLAYER(state, payload) {
      Object.keys(payload).map(key => {
        state[key] = payload[key];
      });
    },
  },
};
