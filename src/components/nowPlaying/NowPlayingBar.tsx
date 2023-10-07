import { Box, IconButton, Stack, Typography } from '@mui/material'
import Slider from '@mui/material/Slider'
import { useCallback } from 'react'
import { Control } from '../Control'
import LikeToggle from '../toggle/likeToggle'
import Image from '@/components/Image'
import { usePlayer, usePlayerControl } from '@/hooks/usePlayer'
import ArtistLink from '@/components/links/artist'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import NowPlayingListToggle from '@/components/toggle/NowPlayingListToggle'

function NowPlayingBar() {
  const { player } = usePlayer()
  const { track, volume, volumeIcon } = usePlayerControl()
  const coverUrl = track?.coverUrl ?? track?.al?.picUrl ?? ''
  const trackDt = track?.dt ?? track?.duration ?? 0


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
        <div className="flex flex-1 items-center gap-4">
          <Box
            sx={{
              height: 56,
              width: 56,
              minWidth: 56,
              minHeight: 56,
              borderRadius: 3.5,
              overflow: 'hidden',
            }}
          >
            <Image src={coverUrl} className="absolute"></Image>
          </Box>
          <div className="flex flex-col justify-center">
            <Typography className="line-clamp-1" variant='h6'>
              {track?.name}
            </Typography>
            {track?.ar?.length && (
              <Typography className="line-clamp-1" variant="caption">
                <ArtistLink artist={track?.ar} />
              </Typography>
            )}
          </div>
          <div>
            <LikeToggle id={track?.id} />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Control />
        </div>
        <div className="flex flex-1 items-center justify-end gap-1">
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
