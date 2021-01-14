// Pathify
import { make } from 'vuex-pathify'

// Data
const state = {
  scrolling: false,
  search: false,
  settings: false,
  version: null,
}

const mutations = make.mutations(state)

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
