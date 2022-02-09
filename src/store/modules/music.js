import { getTrackDetail, sub } from '@api/music';
import { getLikeList, personalFM } from '@api/index';
import { getUserPlaylist } from '@api/user';
import { make } from 'vuex-pathify';
import { uniqWith, isEqual } from 'lodash-es';

let localData = {};

try {
  localData = JSON.parse(localStorage.getItem('music')) ?? {};
} catch (e) {
  console.log('load local data error');
}

const CYCLE_MODE = {
  DISABLE: 0,
  SINGLE_CYCLE: 1,
  CYCLE: 2,
};

const state = {
  playing: false,
  track: localData.track ?? {},
  playingList: localData.playingList ?? { list: [] },
  currentTime: +localStorage.getItem('currentTime') ?? 0,
  showList: false,
  showLyricsPage: false,
  cycle_mode: CYCLE_MODE.CYCLE,
  shuffle: false,
  loadingTrack: false,
  likes: [],
  playlist: [],
  recent: localData.recent ?? [],
  isCurrentFm: false,
  fmTrack: localData.fmTrack ?? {},
  fmList: [], // 私人fm列表（3首）
};

export default {
  namespaced: true,
  state,
  getters: {
    index(state) {
      return state.playingList?.list?.findIndex(
        (track) => track.id === state.track.id,
      );
    },
    nextFmTrackId() {
      return state.fmList[0]?.id;
    },
    nextTrackId(state, getters) {
      const currentId = state.track.id;
      const index = getters['index'];
      let id = null;
      const len = state.playingList?.list?.length;
      const { cycle_mode, playingList } = state;
      if (cycle_mode === CYCLE_MODE.SINGLE_CYCLE) {
        id = currentId;
        // 顺序播放（非最后一曲），或 循环播放，否则下一曲都是当前歌曲
      } else if (cycle_mode === CYCLE_MODE.CYCLE || len - 1 !== index) {
        id = playingList?.list?.[index + 1 === len ? 0 : index + 1]?.id;
      } else if (cycle_mode === CYCLE_MODE.DISABLE && len - 1 === index) {
        // 顺序播放最后一首后不在继续播放
        id = null;
      }
      return id;
    },
    prevTrackId(state, getters) {
      const index = getters['index'];
      return state.playingList?.list?.[
        index === 0 ? state.playingList?.list?.length - 1 : index - 1
      ]?.id;
    },
    liked: (state) => (id) => !!state.likes.find((i) => i === id),
  },
  actions: {
    async fetch({ commit, rootGetters }) {
      if (rootGetters['settings/logged']) {
        const [likesRes, playlistRes] = await Promise.all([
          getLikeList(),
          getUserPlaylist({
            timestamp: new Date().getTime(),
            uid: rootGetters['settings/userId'] ?? '',
          }),
        ]);
        commit('likes', likesRes.ids);
        commit('playlist', playlistRes.playlist);
      }
    },
    async updatePlayingList({ commit, dispatch }, payload) {
      commit('isCurrentFm', false);
      commit('playingList', payload);
      dispatch('saveMusicState');
      return payload;
    },
    async updatePersonalFmList({ commit, state }) {
      let originList = [...state.fmList];
      let pop;
      if (originList.length <= 1) {
        let { data } = await personalFM();
        if (originList.length === 1) {
          pop = originList.shift();
        } else {
          pop = data?.shift();
        }
        commit('fmList', data);
      } else {
        pop = originList.shift();
        commit('fmList', originList);
      }
      return pop;
    },
    async getTrack({ rootGetters, commit, dispatch, rootState }, id) {
      if (!id) return false;
      try {
        const track = await getTrackDetail(
          id,
          rootState.settings.quality,
          rootGetters['settings/logged'],
        );
        commit('track', track);
        if (state.isCurrentFm) {
          commit('fmTrack', track);
        }
        dispatch('saveMusicState');
        return track;
      } catch (e) {
        console.log(e);
      }
    },
    async favSong({ rootGetters, commit, state }, { id, like }) {
      let likes = state.likes;
      if (!rootGetters['settings/logged']) {
        return false;
      } else {
        const { code } = await sub('track', id, like ? 1 : 0);
        if (code === 200) {
          if (like) {
            likes.push(id);
          } else {
            likes = likes.filter((i) => i !== id);
          }
          commit('likes', likes);
          return true;
        } else {
          return false;
        }
      }
    },
    pushRecent({ state, commit, dispatch }, payload) {
      const recent = uniqWith([payload, ...state.recent], isEqual);
      const limit = 100,
        len = recent.length;
      if (len > limit) {
        recent.splice(limit, len - limit);
      }
      try {
        dispatch('saveMusicState');
      } catch (e) {
        console.error(e);
      }
      commit('recent', recent);
    },
    saveMusicState({ state }) {
      localStorage.setItem('music', JSON.stringify(state));
    },
  },
  mutations: {
    ...make.mutations(state),
  },
};
