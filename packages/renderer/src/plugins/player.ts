import type { App } from 'vue'

import { createPlayer } from '@/player'
export const usePlayer = (app: App) => {
  const player = createPlayer()
  app.use(player)
}
