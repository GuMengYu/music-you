import {getTrackDetail} from '@/api/music';
import {make} from 'vuex-pathify';
const PLAY_MODE = {
  ORDER: 0,
  CYCLE: 1,
  SINGLE_CYCLE: 2,
  RANDOM: 3,
};
const state = {
  playing: false,
  track: JSON.parse(localStorage.getItem('track')) ?? {},
  currentTime: localStorage.getItem('currentTime') ?? 0,
  playingList: JSON.parse(localStorage.getItem('playingList')) ?? [],
  showList: false,
  showLyricsPage: false,
  mode: PLAY_MODE.CYCLE,
};

export default {
  namespaced: true,
  state,
  getters: {
    index(state) {
      return state.playingList.findIndex(track => track.id === state.track.id);
    },
    nextTrackId(state, getters) {
      const index = getters['index'];
      let id = state.track.id;
      const len = state.playingList.length;
      const {mode, playingList} = state;
      if (mode === PLAY_MODE.CYCLE || (mode === PLAY_MODE.ORDER && len -1 !== index)){ // 顺序播放（非最后一曲），或 循环播放，否则下一曲都是当前歌曲
        id = playingList[(index + 1) === playingList.length ? 0 : index + 1]?.id;
      }
      return id;
    },
    prevTrackId(state, getters) {
      const index = getters['index'];
      return state.playingList[index  === 0 ? (state.playingList.length - 1) : index - 1]?.id;
    },
  },
  actions: {
    fetch() {

    },
    updatePlayingList({commit}, list) {
      localStorage.setItem('playingList', JSON.stringify(list));
      commit('playingList', list);
    },
    async updateTrack({ rootGetters, commit, dispatch, getters }, id) {
      commit('playing', false);
      commit('currentTime', 0);
      const track = await getTrackDetail(id, rootGetters['settings/logged']);
      commit('track', track);
      localStorage.setItem('track', JSON.stringify(track));
      if (!track.url) {
        dispatch('snackbar/show', {text: '歌曲暂时不可用', type: 'warning'}, {root: true});
        dispatch('updateTrack', getters['nextTrackId']);
      } else {
        commit('playing', true);
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
