import Vuex from 'vuex';
import Vue from 'vue';

import pathify from '@/plugins/pathify'

import * as modules from './modules'
// import localstoragePlugin from './plugins/localstoragePlugin';
Vue.use(Vuex);

export const createStore = () => {
  const store = new Vuex.Store({
    plugins: [pathify.plugin],
    modules,
  });
  store.subscribe(mutation => {
    if (!mutation.type.startsWith('settings/')) return
    store.dispatch('settings/update', mutation);
  });
  return store;
}
