import { useCallback } from 'react'
import { Track, TrackFrom, listType } from '@/types'
import { usePlayer } from '@/hooks/usePlayer'
import { playQueueStore } from '@/store/playQueue'

export function useReplacePlayQueue() {
  const { player } = usePlayer()
  const { updatePlayQueue } = playQueueStore()

  const replaceQueueAndPlay = useCallback((tracks: Track[], id?: number, type?: listType, name?: string) => {
    updatePlayQueue(id, type, name, tracks)
    player.load()
  }, [])
  return {
    replaceQueueAndPlay,
  }
}

export function useAddToPlayQueue() {
  const { player } = usePlayer()
  const { addToPlayQueue, setIndex } = playQueueStore()

  const addToQueueAndPlay = useCallback((track: Track, from?: TrackFrom) => {
    const index = addToPlayQueue(track, from, true)
    setIndex(index)
    player.load()
  }, [])
  /**
   * 下一首播放
   * autoPlay 立即播放
   */
  const playNext = useCallback((track: Track, from?: TrackFrom) => {
    addToPlayQueue(track, from, true)
  }, [])
  return {
    addToQueueAndPlay,
    playNext,
  }
}
