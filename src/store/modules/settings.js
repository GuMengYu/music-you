// Utilities
import { make } from 'vuex-pathify'
import Cookie from 'js-cookie';

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
  },
}

const getters = {
  logged: state => {
    const music_u = Cookie.get('MUSIC_U');
    return music_u && !!state.account.profile;
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
