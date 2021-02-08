// Utilities
import { make } from 'vuex-pathify'


const state = () => {
  let data = JSON.parse(localStorage.getItem('settings')) || {};

  return Object.assign({
    locale: 'zh',
    quality: '192000',
    autoCache: false,
    theme: 'auto',
    volume: 0.8,
    account: {},
  }, data)
}

const mutations = make.mutations(state)

const actions = {
  fetch ({ commit }) {
    const data = state()

    for (const key in data) {
      commit(key, data[key])
    }
  },
  update ({ state }) {
    localStorage.setItem('settings', JSON.stringify(state))
  },
  updateAccount ({commit}, account) {
    commit('account', account);
    localStorage.setItem('account', JSON.stringify(account))
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
