import { useCallback, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { css, cx } from '@emotion/css'
import PlayIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import { formatDuring, sizeOfImage } from '@/util/fn'
import AlbumLink from '@/components/links/album'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import type { Playlist, Track as TrackType } from '@/types'
import { usePlayer } from '@/hooks/usePlayer'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { useLikeTrack } from '@/hooks/useLike'
import { downloadMusic } from '@/hooks/useDownload'

function Track({ track, onPlay, onContextMenu }: {
  track: TrackType
  onPlay: (id: number) => void
  onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, track: TrackType) => void
}) {
  const [isHovering, setIsHovering] = useState(false)
  const { isLiked, toggleLike } = useLikeTrack()
  const theme = useTheme()
  const liked = isLiked(track.id)
  return <Box
    sx={{
      'transition': 'background-color .35s ease',
      '&:hover': {
        bgcolor: alpha(theme.palette.surfaceVariant.main, 0.2),
      },
    }}
    className={
      cx('grid grid-cols-3 gap-4 px-2 h-16 items-center cursor-pointer mb-1 rounded-lg', css`grid-template-columns: 1fr 1fr [last] 140px;`)
    } onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
  onContextMenu={e => onContextMenu && onContextMenu(e, { ...track, liked })}
  >
    <div className='flex gap-2'>
      <div className='h-12 w-12 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden'>
          <Image src={sizeOfImage(track.al?.picUrl, 128)}/>
        </div>
        <AnimatePresence>
          {
            isHovering && <motion.div className='absolute top-0 h-12 w-12 flex justify-center items-center'
              initial={{ opacity: 0, transform: 'translateY(10px)' }}
              animate={{ opacity: 1, transform: 'translateX(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(10px)' }}
              transition={{
                duration: 0.25,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <IconButton onClick={() => onPlay(track.id)}><PlayIcon color='primary'/></IconButton>
            </motion.div>
          }
        </AnimatePresence>
      </div>
      <div className='flex flex-col justify-center'>
        <Typography className='line-clamp-1' variant='body1'>{track.name}</Typography>
        <Typography className='line-clamp-1' variant='caption'>
          {track.ar && <ArtistLink artist={track.ar}/>}
        </Typography>
      </div>
    </div>

    <Typography className='line-clamp-1' variant='body2'>{track.al && <AlbumLink album={track.al}/>}</Typography>

    <div className='flex justify-between items-center'>
      <div className='h-11 w-11'>
        {
          (isHovering || liked) && <motion.div
            initial={{
              opacity: 0, transform: 'translateY(12px)',
            }}
            animate={{
              opacity: 1, transform: 'translateY(0px)',
            }}
            transition={{
              duration: 0.25,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <IconButton sx={{ p: 1.5 }} onClick={() => {
              toggleLike(track.id, liked)
            }}>{
              liked ? <FavoriteIcon fontSize='small'/> : <FavoriteBorderIcon fontSize='small'/>
            } </IconButton>

          </motion.div>
        }

      </div>
      <Typography variant='body2'>{formatDuring(track.dt)}</Typography>
      <div className='h-11 w-11'>
        {
          isHovering && <motion.div
            initial={{
              opacity: 0, transform: 'translateY(12px)',
            }}
            animate={{
              opacity: 1, transform: 'translateY(0px)',
            }}
            transition={{
              duration: 0.25,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <IconButton sx={{ p: 1.5 }} onClick={e => onContextMenu && onContextMenu(e, track)}><MoreHorizIcon fontSize='small' /></IconButton>

          </motion.div>
        }

      </div>

    </div>
  </Box>
}

export default function TrackList({ tracks, source, className }: {
  tracks: TrackType[]
  source?: {
    id?: number
    type?: 'playlist' | 'album' | 'artist'
    own?: boolean // 属于用户自己创建的歌单列表
    playlist?: Playlist // 原始歌单数据
  }
  className?: string
}) {
  const { player } = usePlayer()
  const navigate = useNavigate()
  const { openContextMenu } = useContextMenu()
  const { getToPlaylistMenuItem, removeFromPlaylist } = useTrackOperation()

  const handleTrackPlay = useCallback((trackId: number) => {
    player.updatePlayerTrack(trackId, true, true, false)
  }, [tracks])
  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, track: TrackType) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: '下一首播放',
        onClick: () => {

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
        items: getToPlaylistMenuItem(track),
      },
      ...(source?.own
        ? [{
            type: 'item' as any,
            label: '从本歌单移除',
            onClick: () => {
              removeFromPlaylist(track.id, source.playlist)
              // todo remove from playlist
            },
          }]
        : []),
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
  }, [])

  function toArtist(id: number) {
    navigate(`/artist/${id}`)
  }
  function toAlbum(id: number) {
    navigate(`/album/${id}`)
  }
  return <div className={className}>
    {
      tracks?.length && tracks.map((track) => {
        return <Track track={track} key={track.id} onPlay={handleTrackPlay} onContextMenu={handleContextMenu} />
      })
    }
  </div>
}

export {
  Track,
}
