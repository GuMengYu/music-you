import { Box, Dialog, IconButton, Slide, Typography } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef } from 'react'
import { alpha, useTheme } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
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

const Transition = forwardRef((
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>,
) => {
  return <Slide direction="up" ref={ref} {...props} />
})
export default function NowPlayingPage() {
  const { showNowPlaying, toggleNowPlaying } = useAppStore()
  const { track, currentTime } = usePlayerStore()
  const theme = useTheme()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const trackDt = track?.dt ?? track?.duration ?? 0

  return <Dialog
    sx={{
      '& .MuiPaper-root': {
        borderRadius: 7,
        bgcolor: alpha(theme.palette.surface.main, 0.5),
        backdropFilter: 'blur(100px)',
      },
    }}
    hideBackdrop
    TransitionComponent={Transition}
    open={showNowPlaying}
    fullScreen
    onClose={() => toggleNowPlaying(false)}
  >
    <Box className='p-2 flex flex-col'>
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
            <Typography variant='h5'><AlbumLink album={track['al']}/> - <ArtistLink artist={track['ar']} /></Typography>
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
            <LikeToggle id={track.id}/>
          </Box>
        </div>
      </div>
    </Box>
  </Dialog>
}
