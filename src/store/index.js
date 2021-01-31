import Vuex from 'vuex';
import Vue from 'vue';
import music from './modules/music';
import app from './modules/app';
import localstoragePlugin from './plugins/localstoragePlugin';
Vue.use(Vuex);
const initSettings = {
  lang: 'zh',
  quality: '192000',
  autoCache: false,
  appearance: 'auto',
};
if (!localStorage.getItem('settings')) {
  localStorage.setItem('settings', JSON.stringify(initSettings));
}
export default new Vuex.Store({
  plugins: [localstoragePlugin],
  modules: {
    music,
    app,
  },
});
