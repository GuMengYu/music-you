import { IconButton, Tooltip } from '@mui/material'
import { useAppStore } from '@/store/app'
import { PlaylistIcon } from '@/components/icons/icons'

export default function NowPlayingListToggle() {
  const { toggleNowPlayingList } = useAppStore()
  return <Tooltip title="正在播放队列" placement='top'>
    <IconButton className="no-drag-area" onClick={() => toggleNowPlayingList()}>
      <PlaylistIcon fontSize='small' />
    </IconButton>
  </Tooltip>
}
