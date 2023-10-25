import { IconButton } from '@mui/material'
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture'
import { usePlayerControl } from '@/hooks/usePlayer'

export default function PIPPlayerToggle() {
  const { togglePipPlayer, showPipLyric } = usePlayerControl()
  return <IconButton color={showPipLyric ? 'primary' : 'default'} className="no-drag-area" onClick={togglePipPlayer}>
    <PictureInPictureIcon fontSize='small' />
  </IconButton>
}
