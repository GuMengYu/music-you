// Utilities
import { make } from 'vuex-pathify'
import Cookie from 'js-cookie';

const NETEASEFLAG = 'MUSIC_U';
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
  signOut({commit}) {
    commit('account', {});
    Cookie.remove(NETEASEFLAG);
  },
}

const getters = {
  logged: state => {
    const music_u = Cookie.get(NETEASEFLAG);
    return music_u && !!state.account.profile;
  },
  userId: state => {
    return state.account?.profile?.userId;
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
