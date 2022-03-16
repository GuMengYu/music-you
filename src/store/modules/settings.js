// Utilities
import { make } from 'vuex-pathify';
import { getAccount, logout } from '@api/account';
import { isEmpty } from 'lodash-es';
const state = () => {
  let data = JSON.parse(localStorage.getItem('settings')) || {};

  return Object.assign(
    {
      locale: 'zh',
      quality: '320000',
      cacheLimit: 500,
      theme: 'light',
      customPalette: {
        dataURL: '',
        palette: {},
      },
      palettes: 'GreenMountainTop',
      volume: 0.8,
      dynamicBg: false,
      account: {},
      playingMode: 'basic',
    },
    data,
  );
};

const mutations = make.mutations(state);

const actions = {
  fetch({ commit }) {
    const data = state();

    for (const key in data) {
      commit(key, data[key]);
    }
  },
  update({ state }) {
    localStorage.setItem('settings', JSON.stringify(state));
  },
  async getAccount({ commit }) {
    const { profile } = await getAccount();
    commit('account', { profile });
    return profile;
  },
  updateAccount({ commit }, account) {
    commit('account', account);
  },
  async signOut({ commit }) {
    try {
      await logout();
    } catch (e) {
      console.log(e);
    } finally {
      commit('account', {});
    }
  },
};

const getters = {
  logged: (state) => {
    return !isEmpty(state.account.profile);
  },
  userId: (state) => {
    return state.account?.profile?.userId;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
