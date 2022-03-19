// Pathify
import { make } from 'vuex-pathify';

// Data
const state = {
  showSettings: false,
  showLogin: false,
  showSearch: false,
  showAddToPlayList: false,
  toPlayListTrackId: null,
  drawermini: false,
  version: null,
  nav: [],
  downloadprogress: 0,
};

const mutations = {
  ...make.mutations(state),
  addToPlayList(state, trackId) {
    state.showAddToPlayList = true;
    state.toPlayListTrackId = trackId;
  },
};

const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    const modules = ['settings/fetch', 'music/fetch'];
    for (const module of modules) dispatch(module, null, { root: true });
  },
};

const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
