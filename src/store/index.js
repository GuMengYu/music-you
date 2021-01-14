import Vuex from 'vuex';
import Vue from 'vue';
import music from './modules/music';
import app from './modules/app';
Vue.use(Vuex);
console.log(music);
export default new Vuex.Store({
  modules: {
    music,
    app,
  },
});
