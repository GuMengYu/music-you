// Utilities
import { make } from 'vuex-pathify';

const state = {
  coordinate: [0, 0],
  items: [],
  show: false,
};

const mutations = make.mutations(state);

const actions = {
  ...make.actions(state),
  show({ commit }, payload) {
    const { x, y, items } = payload;
    commit('show', true);
    commit('items', [...items]);
    commit('coordinate', [x, y]);
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
