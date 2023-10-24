import { ipcRenderer } from 'electron'
import { useNavigate } from 'react-router-dom'
import { IconButton, Tooltip } from '@mui/material'
import { MinimizeSquareIcon } from '@/components/icons/icons'

export default function MinimalButton() {
  const navigate = useNavigate()
  async function minimal(e: any) {
    e.preventDefault()
    await ipcRenderer.invoke('minimal', true)
    navigate('/minimal')
  }
  return <Tooltip title="小窗播放" placement='top'>
    <IconButton
      onClick={minimal}>
      <MinimizeSquareIcon fontSize='small' />
    </IconButton>
  </Tooltip>
}
