import { getCurrentInstance, inject } from 'vue'

import { Player } from './base'
export const PlayerSymbol = Symbol.for('Player')

// todo: refactor class player to vue hook
let playerInstance: Player
export function createPlayer() {
  playerInstance = new Player()
  return playerInstance
}

export function usePlayer(): Player {
  getCurrentInstance()

  const player = inject(PlayerSymbol, null)

  if (!player) throw new Error('Could not find Music Player injection')

  return player
}

export function usePlayerOutsideComponent() {
  return playerInstance
}
