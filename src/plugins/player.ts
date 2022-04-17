import { createPlayer } from '@/player/index';

import { App } from 'vue'
export const usePlayer = (app: App) => {
  const player = createPlayer()
  app.use(player)
};
