import {useContext, useMemo} from "react";
import {PlayerContext} from "@/contexts/player";
import {PLAY_MODE, usePlayerStore} from "@/store/player";
import {RepeatOn} from '@mui/icons-material'
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import RepeatIcon from '@mui/icons-material/Repeat';
import {playQueueStore} from "@/store/playQueue";

export const usePlayer = () => {
  const player = useContext(PlayerContext)
  return {
    player
  }
}

export const usePlayerControl = () => {
  const {player} = usePlayer()
  const {
    isCurrentFm,
    playing,
    track,
    loadingTrack,
    playMode,
    setPlayMode,
    shuffle,
    setShuffle,
    volume,
    showPipLyric,
    currentTime,
  } = usePlayerStore()
  const {  shuffle: doShuffule, unShuffle: doUnShuffle} = playQueueStore()
  const isProgram = useMemo(() => track?.source?.fromType === 'program', [track])
  const playPrev = () => {
    player.prev()
  }
  const playNext = () => {
    if (isCurrentFm) {
      player.nextFm()
    } else {
      player.next()
    }
  }
  const playToggle = () => {
    player.togglePlay()
  }
  const playModeToggle = () => {
    const mode = playMode as string
    if (mode === PLAY_MODE.NORMAL) {
      setPlayMode(PLAY_MODE.REPEAT)
    } else if (mode === PLAY_MODE.REPEAT) {
      setPlayMode(PLAY_MODE.REPEAT_ONCE)
    } else if (mode === PLAY_MODE.REPEAT_ONCE) {
      setPlayMode(PLAY_MODE.NORMAL)
    }
  }

  function shuffleToggle() {
    if (shuffle) {
      doUnShuffle()
      setShuffle(false)
    } else {
      doShuffule()
      setShuffle(true)
    }
  }

  function togglePlayingQueue() {
    // if (isQueue.value) {
    //   router.back()
    // } else {
    //   router.push('/queue')
    // }
  }

  return {
    playPrev,
    playNext,
    playToggle,
    shuffleToggle,
    playModeToggle,
    togglePlayingQueue,
    showPipLyric,
    volume,
    playing,
    track,
    isCurrentFm,
    isProgram,
    loadingTrack,
    playMode,
    shuffle,
    currentTime,
  }
}
