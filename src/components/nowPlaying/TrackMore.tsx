import { IconButton, Tooltip } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Track } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { downloadMusic } from '@/hooks/useDownload'

export default function TrackMore({ track }: { track: Track }) {
  const { t } = useTranslation()
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

      // {
      //   type: 'item',
      //   label: '查看评论',
      //   onClick: () => {},
      // },
      {
        label: t`common.to_artist`,
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
        label: t`common.to_album`,
        onClick: () => {
          toAlbum(track.al!.id)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: t`common.add_playlist`,
        items: getToPlaylistMenuItem(track.id),
      },
      {
        type: 'divider',
      },
      {
        type: 'item',
        label: t`common.download_local`,
        onClick: async (i) => {
          await downloadMusic(track)
        },
      },
    ])
  }
  return <Tooltip title={t`common.more_op`} placement='top'><IconButton
   onClick={e => openMore(e)}>
    <MoreVertIcon fontSize='small' />
  </IconButton></Tooltip>
}
