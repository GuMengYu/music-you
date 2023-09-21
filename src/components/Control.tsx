import { IconButton } from '@mui/material'
import {
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
} from '@mui/icons-material'
import PlayToggle from './toggle/PlayToggle'
import { usePlayerControl } from '@/hooks/usePlayer'

function Control() {
  const { playNext, playPrev } = usePlayerControl()
  return (
    <div className="flex gap-3 items-center">
      <IconButton onClick={playPrev}>
        <SkipPreviousIcon fontSize='small' />
      </IconButton>
      <PlayToggle />
      <IconButton onClick={playNext}>
        <SkipNextIcon  fontSize='small' />
      </IconButton>
    </div>
  )
}


export {
  Control,
}
