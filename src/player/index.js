// import { Howl } from 'howler';
// import { sync } from 'vuex-pathify';
// import { throttle } from 'lodash-es';

import Player from './core';

export const usePlayer = (app) => {
  const player = new Player()
  app.use(player)
};
