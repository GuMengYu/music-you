import { IconButton } from '@mui/material'
import {
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
} from '@mui/icons-material'
import PlayToggle from './toggle/PlayToggle'
import { usePlayerControl } from '@/hooks/usePlayer'

function Control() {
  const { playNext, playPrev, modeIcon, shuffleIcon, shuffleToggle, playModeToggle } = usePlayerControl()
  return (
    <div className="flex items-center">
      <IconButton sx={{ p: 2 }} onClick={shuffleToggle}>
        {shuffleIcon}
      </IconButton>
      <IconButton sx={{ p: 2 }} onClick={playPrev}>
        <SkipPreviousIcon fontSize='small' />
      </IconButton>
      <div className='px-1'>
        <PlayToggle />
      </div>
      <IconButton sx={{ p: 2 }} onClick={playNext}>
        <SkipNextIcon  fontSize='small' />
      </IconButton>
      <IconButton sx={{ p: 2 }} onClick={playModeToggle}>
        {modeIcon}
      </IconButton>
    </div>
  )
}


export {
  Control,
}
