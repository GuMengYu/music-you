import { Box, IconButton, Stack, Typography } from '@mui/material'
import Slider from '@mui/material/Slider'
import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import OpenInFullIcon from '@mui/icons-material/OpenInFull';import { Control } from '../Control'
import LikeToggle from '../toggle/likeToggle'
import Image from '@/components/Image'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'
import ArtistLink from '@/components/links/artist'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import NowPlayingListToggle from '@/components/toggle/NowPlayingListToggle'
import { useAppStore } from '@/store/app'
import PIPPlayerToggle from '@/components/toggle/PIPPlayerToggle'

function NowPlayingBar() {
  const { player } = usePlayer()
  const { toggleNowPlaying } = useAppStore()
  const { track, volume, volumeIcon } = usePlayerControl()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const trackDt = track?.dt ?? track?.duration ?? 0

  const [isHovering, setIsHovering] = useState(false)



  const handleVolumeChange = useCallback((val: number) => {
    player.setVolume(val)
  }, [])
  return (
    <Box
      component="footer"
      sx={{
        px: 1,
        height: 72,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      <div className="flex w-full h-full">
        <NowPlayingSlider
          sx={{
            position: 'absolute',
            top: -13,
            width: 'calc(100% - 12px)',
            margin: '0 2px',
          }}
        />
        <div className="flex flex-1 items-center gap-2">
          <Box
            sx={{
              height: 56,
              width: 56,
              minWidth: 56,
              minHeight: 56,
              borderRadius: 3.5,
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseEnter={ () => setIsHovering(true)}
            onMouseLeave={ () => setIsHovering(false)}
          >
            <Image src={coverUrl} className="absolute"></Image>
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  className='w-full h-full absolute bottom-0 right-0'
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                >
                  <IconButton
                    sx={{
                      p: 2,
                    }}
                    onClick={() => toggleNowPlaying()}
                  >
                    <OpenInFullIcon color={'tertiary' as 'primary'}  />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          <div className="flex flex-col justify-center ml-2">
            <Typography className="line-clamp-1" variant='h6'>
              {track?.name}
            </Typography>
            {track?.ar?.length && (
              <Typography className="line-clamp-1" variant="caption">
                <ArtistLink artist={track?.ar} />
              </Typography>
            )}
          </div>
          <LikeToggle id={track?.id} />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Control />
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
          <PIPPlayerToggle />
          <Stack direction="row" sx={{ width: 130 }} alignItems="center">
            <IconButton>
              { volumeIcon }
            </IconButton>
            <Slider size='small' aria-label="Volume" step={0.05} min={0} max={1} value={volume} onChange={(_, val) => handleVolumeChange(val as number)} />
          </Stack>
          <NowPlayingListToggle />
        </div>
      </div>
    </Box>
  )
}

export default NowPlayingBar
