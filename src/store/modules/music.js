import {getLyric, getSongData, getSongUrl} from '@util/musicService';
import {make} from 'vuex-pathify';
const state = {
  playing: false,
  track: JSON.parse(localStorage.getItem('track')) ?? {},
  currentTime: localStorage.getItem('currentTime') ?? 0,
  playingList: JSON.parse(localStorage.getItem('playingList')) ?? [],
  showList: false,
  showLyricsPage: false,
};

const getTrackDetail = async (id, logged) => {
  const { songs: [track] } = await getSongData([id]);
  const {lrc, nolyric} = await getLyric(id);
  const lyric = nolyric ? [] : lrc.lyric?.split('\n').map(i => {
    const [time, sentence] = i.split(']');
    return {time, sentence};
  });
  let url;
  if (logged) {
    const { data: [song] } = await getSongUrl(id);
    if (song?.freeTrialInfo) {
      url = null;
    } else {
      url = song.url;
    }
  } else {
    url = `https://music.163.com/song/media/outer/url?id=${id}`
  }
  return {...track, url, lyric};
}
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
    async updateTrack({ rootGetters, commit }, id) {
      commit('playing', false);
      commit('currentTime', 0);
      getTrackDetail(id, rootGetters['settings/logged']).then(track => {
        if (!track.url) {
          commit('snackbar', {snackbar: {}, value: true});
        } else {
          commit('track', track);
          commit('playing', true);
          localStorage.setItem('track', JSON.stringify(track));
        }
      });
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
