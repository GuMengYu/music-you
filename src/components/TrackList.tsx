import { useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { css, cx } from '@emotion/css'
import PlayIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import { AnimatePresence, motion } from 'framer-motion'
import { formatDuring } from '@/util/fn'
import AlbumLink from '@/components/links/album'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import type { Track as TrackType } from '@/types'


function Track({ track }: {
  track: TrackType
}) {
  const [isHovering, setIsHovering] = useState(false)
  return <div
    className={
      cx('grid grid-cols-3 gap-4 px-1 h-16 items-center cursor-pointer mb-1 rounded-lg', css`grid-template-columns: 1fr 1fr [last] 126px;`)
    } onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}>
    <div className='flex gap-2'>
      <div className='h-12 w-12 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden'>
          <Image src={track.al?.picUrl}/>
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
              <IconButton><PlayIcon color='primary'/></IconButton>
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
      <div className='h-9 w-9'>
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
            <IconButton><FavoriteBorderIcon fontSize='small'/></IconButton>

          </motion.div>
        }

      </div>
      <Typography variant='body2'>{formatDuring(track.dt)}</Typography>
      <div className='h-9 w-9'>
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
            <IconButton><MoreHorizIcon fontSize='small'/></IconButton>

          </motion.div>
        }

      </div>

    </div>
  </div>
}

export default function TrackList({ tracks, id, className }: {
  tracks: TrackType[]
  id?: number
  className?: string
}) {
  return <div className={className}>
    {
      tracks.length && tracks.map((track) => {
        return <Track track={track} key={track.id}/>
      })
    }
  </div>
}

export {
  Track,
}
