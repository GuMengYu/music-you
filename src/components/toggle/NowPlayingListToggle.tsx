import { IconButton } from '@mui/material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import { useAppStore } from '@/store/app'

export default function NowPlayingListToggle() {
  const { toggleNowPlayingList } = useAppStore()
  return <IconButton className="no-drag-area" onClick={() => toggleNowPlayingList()}>
    <QueueMusicIcon fontSize='small'  />
  </IconButton>
}
