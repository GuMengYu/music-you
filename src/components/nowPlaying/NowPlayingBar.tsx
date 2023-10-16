import { Box, IconButton, Stack, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
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

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 150 : -150,
      opacity: 0,
    }
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 150 : -150,
      opacity: 0,
    }
  },
}
function NowPlayingBar() {
  const { player } = usePlayer()
  const { toggleNowPlaying } = useAppStore()
  const { track, volume, volumeIcon } = usePlayerControl()
  const [animateRef, animate] = useAnimate()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const [isHovering, setIsHovering] = useState(false)
  const [cacheVolume, setCacheVolume] = useState(0)


  // useEffect(() => {
  //   animate(animateRef.current, { transform: 'translateX(0px)' }, { duration: 0.45, ease: [0.47, 1.64, 0.41, 0.8] })
  // }, [track])

  const handleVolumeChange = useCallback((val: number) => {
    player.setVolume(val)
  }, [])

  function handleMute() {
    if (volume === 0) {
      player.setVolume(cacheVolume)
    }
    else {
      setCacheVolume(volume)
      player.setVolume(0)
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
        <div className='flex items-center relative flex-1'>
          <AnimatePresence initial={false} custom={1}>
            <motion.div
              // ref={animateRef}
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.35, ease: [0.2, 0.0, 0, 1.0] },
                opacity: { duration: 0.25, ease: [0.2, 0.0, 0, 1.0] },
              }}
              key={track.id}
              // style={{ transform: 'translateX(20px)' }}
              className="flex items-center gap-2 absolute w-full">
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
            </motion.div>
          </AnimatePresence>
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
