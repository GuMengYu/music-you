import { IconButton } from '@mui/material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import { useAppStore } from '@/store/app'

export default function NowPlayingListToggle() {
  const { toggleNowPlayingList } = useAppStore()
  return <IconButton color="primary" className="no-drag-area" onClick={() => toggleNowPlayingList()} sx={{
    height: 56,
    width: 56,
  }}>
    <QueueMusicIcon sx={{ height: 20, width: 20 }} />
  </IconButton>
}
