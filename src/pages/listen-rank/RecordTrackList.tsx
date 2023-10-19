import { useCallback, useState } from 'react'
import { IconButton, Typography } from '@mui/material'
import { cx } from '@emotion/css'
import PlayIcon from '@mui/icons-material/PlayArrow'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'

import { AnimatePresence, motion } from 'framer-motion'
import Box from '@mui/material/Box'
import { maxBy } from 'lodash-es'
import { useTheme } from '@mui/material/styles'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { sizeOfImage } from '@/util/fn'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import type { Track as TrackType } from '@/types'
import { usePlayer } from '@/hooks/usePlayer'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { useLikeTrack } from '@/hooks/useLike'
import { downloadMusic } from '@/hooks/useDownload'
import { PlayRecord } from '@/api/user'
import AlbumLink from '@/components/links/album'


function Record({ record, onPlay, onContextMenu, color, count, max }: {
  color?: string
  record: PlayRecord
  count: number
  max: number
  onPlay: (id: number) => void
  onContextMenu?: (e: React.MouseEvent<HTMLElement, MouseEvent>, track: TrackType) => void
}) {
  const [isHovering, setIsHovering] = useState(false)
  const { isLiked, toggleLike } = useLikeTrack()
  const liked = isLiked(record.song.id)
  return <div
    className={
      cx('grid grid-cols-2 gap-4 px-1 h-16 items-center cursor-pointer mb-1 rounded-lg')
    } onMouseEnter={() => setIsHovering(true)}
    onMouseLeave={() => setIsHovering(false)}
    onContextMenu={e => onContextMenu && onContextMenu(e, { ...record.song, liked })}
  >
    <div className='flex gap-2'>
      <div className='h-12 w-12 flex-shrink-0 relative'>
        <div className='h-full w-full rounded-xl overflow-hidden'>
          <Image src={sizeOfImage(record.song.al?.picUrl, 128)}/>
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
                  <IconButton onClick={() => onPlay(record.song.id)}><PlayIcon color='primary'/></IconButton>
              </motion.div>
          }
        </AnimatePresence>
      </div>
      <div className='flex flex-col justify-center'>
        <Typography className='line-clamp-1' variant='body1'>{record.song.name}</Typography>
        <Typography className='line-clamp-1' variant='caption'>
          <span>{record.song.ar && <ArtistLink artist={record.song.ar}/>}</span>
          {
            record.song.al && (<span> - <AlbumLink album={record.song.al}/></span>)
          }
        </Typography>
      </div>
    </div>
    <Box className='h-full relative flex justify-end items-center'>
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
                  toggleLike(record.song.id, liked)
                }}>{
                  liked ?  <FavoriteIcon fontSize='small'/> : <FavoriteBorderIcon fontSize='small'/>
                } </IconButton>

            </motion.div>
        }

      </div>
      <Typography className='w-14 text-center' variant='body2'>{count} 次</Typography>
      <IconButton sx={{ p: 1.5 }} onClick={e => onContextMenu && onContextMenu(e, record.song)}><MoreVertIcon fontSize='small' /></IconButton>
    </Box>
  </div>
}

export default function RecordTrackList({ records, className }: {
  records: PlayRecord[]
  className?: string
}) {
  const { player } = usePlayer()
  const { openContextMenu } = useContextMenu()
  const theme = useTheme()
  const { getToPlaylistMenuItem, removeFromPlaylist } = useTrackOperation()
  const maxCount = maxBy(records, r => r.playCount )?.playCount ?? 0

  const handleTrackPlay = useCallback((trackId: number) => {
    player.updatePlayerTrack(trackId, true, true, false)
  }, [])
  const handleContextMenu = useCallback((e:  React.MouseEvent<HTMLElement, MouseEvent>, track: TrackType) => {
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
      {
        type: 'submenu',
        label: '添加到歌单',
        items: getToPlaylistMenuItem(track),
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
  }, [])

  return <div className={className}>
    {
      records.length && records.map((record) => {
        return <Record
          key={record.song.id}
          record={record}
          count={record.playCount}
          max={maxCount}
          color={theme.palette.surfaceVariant.main}
          onPlay={handleTrackPlay}
          onContextMenu={handleContextMenu} />
      })
    }
  </div>
}
