import { useCallback } from 'react'
import { Track, listType } from '@/types'
import { usePlayer } from '@/hooks/usePlayer'
import { playQueueStore } from '@/store/playQueue'

export default function usePlayQueue() {
  const { player } = usePlayer()
  const { updatePlayQueue } = playQueueStore()

  const addToQueueAndPlay = useCallback((tracks: Track[], id?: number, type?: listType, name?: string) => {
    updatePlayQueue(id, type, name, tracks)
    player.next()
  }, [])
  return {
    addToQueueAndPlay,
  }
}
