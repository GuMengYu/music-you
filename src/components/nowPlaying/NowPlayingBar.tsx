import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Control } from '../Control'
import Image from '@/components/Image'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'
import ArtistLink from '@/components/links/artist'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import NowPlayingListToggle from '@/components/toggle/NowPlayingListToggle'
import { useAppStore } from '@/store/app'
import PIPPlayerToggle from '@/components/toggle/PIPPlayerToggle'
import MdSlider from '@/components/Slider'
import TrackMore from '@/components/nowPlaying/TrackMore'
import PodcastLink from '@/components/links/podcast'
import ResourceThumbToggle from '@/components/toggle/ResourceThumbToggle'
import { RESOURCE_TYPE } from '@/util/enum'
import LikeToggle from '@/components/toggle/likeToggle'
import MinimalButton from '@/components/button/MinimalButton'
import { sizeOfImage } from '@/util/fn'

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
  const { t } = useTranslation()
  const { player } = usePlayer()
  const { toggleNowPlaying } = useAppStore()
  const { track, volume, volumeIcon, isProgram } = usePlayerControl()
  const coverUrl = useMemo(() => {
    // 本地音乐返回的封面是bast64 不能加sizeOfImage参数处理
    return track?.source?.fromType === 'local' ? track?.al.picUrl : sizeOfImage(track?.coverUrl ?? track?.al?.picUrl ?? '')
  }, [track])
  const [isHovering, setIsHovering] = useState(false)
  const [cacheVolume, setCacheVolume] = useState(0)

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
  function SubTitle() {
    if (isProgram && track) {
      return <span><PodcastLink podcast={track.radio as any} /> - [{t`main.podcast.program`}]</span>
    }
    else if (track?.ar) {
      return <Typography className="line-clamp-1" variant="caption">
        <ArtistLink artist={track?.ar} />
      </Typography>
    }
    else {
      return <span>{t`common.unknown`}</span>
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
              custom={1}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { duration: 0.35, ease: [0.2, 0.0, 0, 1.0] },
                opacity: { duration: 0.25, ease: [0.2, 0.0, 0, 1.0] },
              }}
              key={track?.id}
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
                        <OpenInFullIcon color={'tertiary' as 'primary'} />
                      </IconButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
              <div className="flex flex-col justify-center ml-2">
                <Typography className="line-clamp-1" variant='h6'>
                {
                  track?.al?.id ? <RouterLink to={`/album/${track.al.id}`}>{track.name}</RouterLink> : track?.name
                }
                  </Typography>
                <Typography className="line-clamp-1" variant='caption'>
                  <SubTitle />
                </Typography>
              </div>
              {
                isProgram && track
                  ? <ResourceThumbToggle type={RESOURCE_TYPE.PROGRAM} id={track.id} liked={track.liked} />
                  : <LikeToggle id={track?.id} />
              }

            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Control />
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
          <MinimalButton />
          <PIPPlayerToggle />
          <Stack direction="row" sx={{ width: 130 }} alignItems="center" spacing={0.5}>
            <Tooltip title={ volume === 0 ? `${t`common.cancel`} ${t`common.mute`}` : t`common.mute` } placement='top'>
            <IconButton onClick={handleMute}>
              { volumeIcon }
            </IconButton>
            </Tooltip>
            <MdSlider size='small' aria-label="Volume" step={0.05} min={0} max={1} value={volume} valueLabelDisplay='off' onChange={(_, val) => handleVolumeChange(val as number)} />
          </Stack>
          <NowPlayingListToggle />
          <TrackMore track={track} />
        </div>
      </div>
    </Box>
  )
}

export default NowPlayingBar
