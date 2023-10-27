import { IconButton, Tooltip } from '@mui/material'
import PlayToggle from './toggle/PlayToggle'
import {
  SkipNextIcon,
  SkipPreviousIcon,
} from '@/components/icons/icons'
import { usePlayerControl } from '@/hooks/usePlayer'

function Control({ compact }: { compact?: boolean }) {
  const { playNext, playPrev, modeIcon, shuffleIcon, shuffle, shuffleToggle, playModeToggle } = usePlayerControl()
  return (
    <div className="flex items-center gap-x-1.5">
      {
        !compact && <Tooltip title={shuffle ? '取消随机播放' : '启用随机播放'} placement='top'>
          <IconButton sx={{ p: 1.25 }} onClick={shuffleToggle}>
          {shuffleIcon}
          </IconButton>
        </Tooltip>
      }

      <IconButton sx={{ p: 1.25 }} onClick={playPrev}>
        <SkipPreviousIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <div className='px-1'>
        <PlayToggle />
      </div>
      <IconButton sx={{ p: 1.25 }} onClick={playNext}>
        <SkipNextIcon sx={{ fontSize: 16 }} />
      </IconButton>
      {
        !compact && <IconButton sx={{ p: 1.25 }} onClick={playModeToggle}>
          {modeIcon}
          </IconButton>
      }

    </div>
  )
}

export {
  Control,
}
