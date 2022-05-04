import { getCurrentInstance, inject } from 'vue'

import type { PlayerInstance } from './base'
import { Player } from './base'

export const PlayerSymbol = Symbol.for('Player')

// todo: refactor class player to vue hook
export function createPlayer() {
  return new Player()
}

export function usePlayer(): PlayerInstance {
  getCurrentInstance()

  const player = inject(PlayerSymbol, null)

  if (!player) throw new Error('Could not find Music Player injection')

  return player
}
