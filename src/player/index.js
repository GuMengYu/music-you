// import { Howl } from 'howler';
// import { sync } from 'vuex-pathify';
// import { throttle } from 'lodash-es';
import Vue from 'vue';

import Player from './core';

Vue.use(Player);

export const createPlayer = (store) => {
  return new Player(store);
};
