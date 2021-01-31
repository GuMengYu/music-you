// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  scrolling: false,
  search: false,
  showSettings: false,
  settings: JSON.parse(localStorage.getItem('settings')) ?? {},
  version: null,
}

const mutations = make.mutations(state)
mutations['updateSettings'] = (state, data) => {
  Object.entries(data).map(([key, value]) => {
    state.settings[key] = value;
  });
};
const actions = {
  ...make.actions(state),
}

const getters = {}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
