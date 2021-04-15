// Utilities
import { make } from 'vuex-pathify';

const state = {
  snackbar: {
    action_text: '',
    action: '',
    color: 'success',
    emoji: '',
    slug: null,
    text: '',
    timeout: '-1',
  },
  value: false,
};

const mutations = make.mutations(state);

const actions = {
  show({ commit, state }, payload) {
    const { type, text, timeout = 1000 } = payload;
    commit('snackbar', {
      ...state.snackbar,
      ...{ text, timeout, color: type },
    });
    commit('value', true);
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
