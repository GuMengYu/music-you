import { Box, IconButton, Stack, Typography } from '@mui/material'
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
import MdSlider from '@/components/Slider'
import TrackMore from '@/components/nowPlaying/TrackMore'

function NowPlayingBar() {
  const { player } = usePlayer()
  const { toggleNowPlaying } = useAppStore()
  const { track, volume, volumeIcon } = usePlayerControl()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const trackDt = track?.dt ?? track?.duration ?? 0

  const [isHovering, setIsHovering] = useState(false)
  const [cacheVolume, setCacheVolume] = useState(0)


  const handleVolumeChange = useCallback((val: number) => {
    player.setVolume(val)
  }, [])

  function handleMute() {
    if (volume === 0) {
      // sliderVolume.value = cacheVolume.value
      player.setVolume(cacheVolume)
    }
    else {
      setCacheVolume(volume)
      player.setVolume(0)

      // sliderVolume.value = 0.0
      // sliderVolume.value = 0
    }
  }
  return (
    <Box
      component="footer"
      sx={{
        px: 1,
        height: 72,
        zIndex: 9999,
        gridArea: 'now-playing-bar',
      }}
    >
      <div className="flex w-full h-full relative">
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            width: '100%',
            // margin: '0 2px',
          }}
        >
          <NowPlayingSlider

          />
        </Box>

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
          <Stack direction="row" sx={{ width: 130 }} alignItems="center" spacing={1}>
            <IconButton onClick={handleMute}>
              { volumeIcon }
            </IconButton>
            <MdSlider size='small' aria-label="Volume" step={0.05} min={0} max={1} value={volume} valueLabelDisplay='auto' onChange={(_, val) => handleVolumeChange(val as number)} />
          </Stack>
          <NowPlayingListToggle />
          <TrackMore track={track} />
        </div>
      </div>
    </Box>
  )
}

export default NowPlayingBar
