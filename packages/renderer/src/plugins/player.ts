import type { App } from 'vue'

import { createPlayer } from '@/player'
export const player = createPlayer()
export const usePlayer = (app: App) => {
  app.use(player)
}
