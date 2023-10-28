import { useCallback, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { css, cx } from '@emotion/css'
import PlayIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatDuring, sizeOfImage } from '@/util/fn'
import AlbumLink from '@/components/links/album'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import type { Track, TrackFrom } from '@/types'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useLikeTrack } from '@/hooks/useLike'
import { downloadMusic } from '@/hooks/useDownload'
import { useAddToPlayQueue } from '@/hooks/usePlayQueue'

function CloudTrackItem({ track, onContextMenu }: {
  track: Track
  onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => void
}) {
  const [isHovering, setIsHovering] = useState(false)
  const { isLiked, toggleLike } = useLikeTrack()
  const { addToQueueAndPlay } = useAddToPlayQueue()
  const liked = isLiked(track.id)
  const handlePlay = useCallback(()=> {
    addToQueueAndPlay(track, { id: 0, type: 'cloud', name: '云盘' })
  }, [track])
  return <div
    className={
      cx('grid grid-cols-3 gap-4 px-1 h-16 items-center cursor-pointer mb-1 rounded-lg', css`grid-template-columns: 1fr 1fr [last] 140px;`)
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
                  <IconButton onClick={handlePlay}><PlayIcon color='primary'/></IconButton>
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
  </div>
}

export default function CloudTrackList({ tracks, className }: {
  tracks: Track[]
  className?: string
}) {
  const { openContextMenu } = useContextMenu()
  const { t } = useTranslation()
  const { playNext } = useAddToPlayQueue()
  const trackFrom: TrackFrom = { id: 0, type: 'cloud', name: '云盘' }

  const handleContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>, track: Track) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: t`common.next_play`,
        onClick: () => {
          playNext(track, trackFrom)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'item',
        label: t`common.download_local`,
        onClick: async () => {
          await downloadMusic(track)
        },
      },
    ], {
      useCursorPosition: true,
    })
  }, [])

  return <div className={className}>
    {
      tracks.length && tracks.map((track) => {
        return <CloudTrackItem track={track} key={track.id} onContextMenu={handleContextMenu} />
      })
    }
  </div>
}
