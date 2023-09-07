import type { SliderProps } from '@mui/material/Slider'
import Slider from '@mui/material/Slider'
import { useState } from 'react'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'

export default function NowPlayingSlider(props: SliderProps) {
  const { player } = usePlayer()
  const { track, currentTime } = usePlayerControl()
  const trackDt = track?.dt ?? track?.duration ?? 0

  const [position] = useState(0)

  function handleSliderChange( value: number) {
    console.log(value)
    player.setSeek(value)
  }
  function dragStart(value: number) {
    // player.pauseProgress()
  }
  function dragEnd(val: number) {
    // player.setSeek(val)
    // player.restoreProgress()
  }

  return <Slider
    {...props}
    value={currentTime}
    size="small"
    max={trackDt / 1000}
    min={0}
    step={1}
    aria-label="track-slider"
    valueLabelDisplay="auto"
    // onChange={(_, value) => dragStart(value as number)}
  />
}

