import { IconButton, Tooltip } from '@mui/material'
import { usePlayerControl } from '@/hooks/usePlayer'
import { PipBoldIcon } from '@/components/icons/icons'

export default function PIPPlayerToggle() {
  const { togglePipPlayer, showPipLyric } = usePlayerControl()
  return <Tooltip title="画中画" placement='top'>
    <IconButton color={showPipLyric ? 'primary' : 'default'} className="no-drag-area" onClick={togglePipPlayer}>
      <PipBoldIcon fontSize='small' />
    </IconButton>
  </Tooltip>

}
