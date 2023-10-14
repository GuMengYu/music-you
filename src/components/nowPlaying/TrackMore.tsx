import { IconButton } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import type { Track } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { downloadMusic } from '@/hooks/useDownload'

export default function TrackMore({ track }: { track: Track }) {
  const { openContextMenu } = useContextMenu()
  const navigate = useNavigate()
  const { getToPlaylistMenuItem } = useTrackOperation()

  function toArtist(id: number) {
    navigate(`/artist/${id}`)
  }
  function toAlbum(id: number) {
    navigate(`/album/${id}`)
  }
  function openMore(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    openContextMenu(e, [

      {
        type: 'item',
        label: '查看评论',
        onClick: () => {},
      },
      {
        label: '转至艺人',
        ...(track.ar && track.ar.length > 1
          ? {
              type: 'submenu',
              items: track.ar?.map((artist) => {
                return {
                  type: 'item',
                  label: artist.name,
                  onClick: () => {
                    toArtist(artist.id)
                  },
                }
              }),
            }
          : {
              type: 'item',
              onClick: (i) => {
                toArtist(track.ar![0].id)
              },
            }),
      },

      {
        type: 'item',
        label: '转至专辑',
        onClick: () => {
          toAlbum(track.al!.id)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: '添加到歌单',
        items: getToPlaylistMenuItem(track),
      },
      {
        type: 'divider',
      },
      {
        type: 'item',
        label: '下载到本地',
        onClick: async (i) => {
          await downloadMusic(track)
        },
      },
    ])
  }
  return <IconButton
  sx={{
    // p: 2,
  }} onClick={e => openMore(e)}>
    <MoreVertIcon fontSize='small' />
  </IconButton>
}
