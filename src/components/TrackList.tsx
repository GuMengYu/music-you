import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'
import TrackItem from './TrackItem'
import type { Track, TrackFrom } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { downloadMusic } from '@/hooks/useDownload'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'

export default function TrackList({ tracks, trackFrom, className }: {
  tracks?: Track[]
  trackFrom?: TrackFrom
  className?: string
}) {
  const navigate = useNavigate()
  const { openContextMenu } = useContextMenu()
  const { getToPlaylistMenuItem, removeFromPlaylist } = useTrackOperation()
  const { addToQueueAndPlay, playNext } = useAddToPlayQueue()

  const handleTrackPlay = useCallback((track: Track) => {
    addToQueueAndPlay(track, trackFrom)
  }, [trackFrom])
  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: '下一首播放',
        onClick: () => {
          playNext(track, trackFrom)
        },
      },
      {
        type: 'divider',
      },
      // {
      //   type: 'item',
      //   label: '查看评论',
      //   onClick: () => {},
      // },
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
        items: getToPlaylistMenuItem(track.id),
      },
      {
        type: 'item',
        label: '下载到本地',
        onClick: async (i) => {
          await downloadMusic(track)
        },
      },
    ], {
      useCursorPosition: true,
    })
  }, [trackFrom])

  function toArtist(id: number) {
    navigate(`/artist/${id}`)
  }
  function toAlbum(id: number) {
    navigate(`/album/${id}`)
  }
  return <div className={className}>
    {
      tracks?.length && tracks.map((track) => {
        return <TrackItem track={track} key={track.id} onPlay={handleTrackPlay} onContextMenu={handleContextMenu} />
      })
    }
  </div>
}
