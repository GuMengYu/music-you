import { inject, getCurrentInstance } from 'vue'
import { Player } from './base';

export const PlayerSymbol = Symbol.for('Player');

export function createPlayer() {
    return new Player();
}

export function usePlayer() {
    getCurrentInstance()
  
    const player = inject(PlayerSymbol, null)
  
    if (!player) throw new Error('Could not find Music Player injection')

    return player
  }
  