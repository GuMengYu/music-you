// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  showSettings: false,
  showLogin: false,
  version: null,
  nav: [],
}

const mutations = make.mutations(state)
mutations['updateSettings'] = (state, data) => {
  Object.entries(data).map(([key, value]) => {
    state.settings[key] = value;
  });
};
const actions = {
  ...make.actions(state),
  init: async ({ dispatch }) => {
    const modules = ['settings/fetch', 'music/fetch']
    for (const module of modules) dispatch(module, null, {root: true})
  },
}

const getters = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
