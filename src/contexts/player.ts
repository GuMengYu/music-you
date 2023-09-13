import { createContext } from 'react'
import { createPlayer } from '@/player/base'

export const PlayerContext = createContext(createPlayer())
export const PlayerProvider = PlayerContext.Provider