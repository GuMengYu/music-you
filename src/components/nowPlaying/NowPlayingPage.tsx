import { Box, Dialog, IconButton, Slide, Typography } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef, memo, useCallback, useState } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import WallpaperIcon from '@mui/icons-material/Wallpaper'
import { motion } from 'framer-motion'
import NowPlayingLyric from './NowPlayingLyric'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import AlbumLink from '@/components/links/album'
import { Control } from '@/components/Control'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import { formatDuring } from '@/util/fn'
import LikeToggle from '@/components/toggle/likeToggle'
import WallpaperPage from '@/pages/Wallpaper'

const Transition = forwardRef((
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />
})

const NowPlayingWallpaper = memo(({ open, onClose }: { open: boolean; onClose?: () => void }) => {
  return <Dialog fullScreen open={open} onClose={onClose}>
    <Box className='p-4 hide-scrollbar h-full overflow-y-auto' sx={{

    }}>
      <WallpaperPage />

    </Box>
  </Dialog>
})

function NowPlayingPageBackDrop() {
  const theme = useTheme()
  const { track } = usePlayerStore()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''

  return <Box
  sx={{
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    borderRadius: 7,
    // backgroundImage: `url(${coverUrl})`,
    // backgroundSize: 'cover',
    bgcolor: alpha(theme.palette.surface.main, 0.7),
    backdropFilter: 'blur(100px)',
    zIndex: -1,
    filter: 'blur(100px)',
  }}
  ></Box>
}
export default function NowPlayingPage() {
  const { showNowPlaying, toggleNowPlaying } = useAppStore()
  const { track, currentTime } = usePlayerStore()
  const theme = useTheme()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const trackDt = track?.dt ?? track?.duration ?? 0

  const [bgSet, setBgSet] = useState(false)

  const handleCloseWallpaperSet = useCallback(() => {
    setBgSet(false)
  }, [])
  return <Dialog
    sx={{
      '& .MuiPaper-root': {
        borderRadius: 7,
        bgcolor: 'transparent',
        // backdropFilter: 'blur(100px)',
      },
    }}
    TransitionComponent={Transition}
    open={showNowPlaying}
    fullScreen
    onClose={() => toggleNowPlaying(false)}
    slots={{
      backdrop: NowPlayingPageBackDrop,
    }}
  >
    <Box className='p-2 flex flex-col h-full'>
      <div className="frame-header flex pt-2 px-2 justify-end drag-area">
        <IconButton className="no-drag-area" onClick={() => toggleNowPlaying(false)}>
          <CloseIcon />
        </IconButton>
      </div>
      <Box className="frame-content flex justify-center items-center text-center py-4 hide-scrollbar overflow-y-auto" sx={{
        maxHeight: 'calc(78vh - 132px)',
      }}>
        <NowPlayingLyric enable={true} />
      </Box>
      <div className='frame-footer flex flex-col px-2 gap-2 mt-auto'>
        <motion.div
          initial={{
            transform: 'translateX(30px)',
          }}
          animate={{
            transform: 'translateX(0px)',
            transition: {
              duration: 0.3,
            } }}
        >
        <div className="flex gap-4">

            <Box className='overflow-hidden rounded-lg' sx={{ height: '22vh', width: '22vh', maxWidth: '22vh' }}>
              <Image src={coverUrl} />
            </Box>
          <div className="flex flex-col justify-evenly">
            <Typography variant='h5'><AlbumLink album={track?.al}/> - <ArtistLink artist={track?.ar} /></Typography>
            <Typography variant='h4' className="font-weight-regular">{ track?.name }</Typography>
          </div>
        </div>
        </motion.div>
        <div className="flex justify-between items-center mb-2">
          <Box className='flex justify-center' sx={{
            width: '22vh',
            maxWidth: '22vh',
          }}>
            <Control compact />
          </Box>
          <div className="flex flex-grow items-center">
            <Typography variant='subtitle2' className="flex justify-center" style={{ width: '65px' }}>{ formatDuring(currentTime * 1000) }</Typography>
            <NowPlayingSlider className="track-slider mx-2" />
            <Typography variant='subtitle2' className="flex justify-center" style={{ width: '65px' }}>{ formatDuring(track?.['dt']) }</Typography>
          </div>
          <Box className='flex'>
            <LikeToggle id={track?.id}/>
          </Box>
          <IconButton onClick={() => setBgSet(true)}>
            <WallpaperIcon />
          </IconButton>
        </div>
      </div>
      <NowPlayingWallpaper open={bgSet} onClose={handleCloseWallpaperSet} />
    </Box>
  </Dialog>
}
