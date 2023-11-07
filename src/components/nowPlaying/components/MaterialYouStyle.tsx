import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { forwardRef, useCallback, useMemo } from 'react'
import { alpha } from '@mui/material/styles'
import { KeyboardArrowDown } from '@mui/icons-material'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import { formatDuring } from '@/util/fn'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'
import NowPlayingLyric from '@/components/nowPlaying/NowPlayingLyric'
import TrackMore from '@/components/nowPlaying/TrackMore'
import { useSematicBreakPoint } from '@/hooks/useBreakpoint'
import MdControl from '@/components/nowPlaying/components/MdControl'

const MaterialYouStyle = forwardRef((_, ref)=> {
  const theme = useTheme()
  const { breakname } = useSematicBreakPoint()

  const { t } = useTranslation()
  const responsiveSize = useMemo(() => {
    return {
      xxs: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',
      },
      xs: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',

      },
      sm: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',

      },
      md: {
        button: 48,
        icon: 24,
        titleVariant: 'h6',
        subtitleVariant: 'subtitle2',

      },
      lg: {
        button: 64,
        icon: 30,
        titleVariant: 'h4',
        subtitleVariant: 'body1',

      },
      xl: {
        button: 64,
        icon: 30,
        titleVariant: 'h4',
        subtitleVariant: 'body1',
      },
      xll: {
        button: 72,
        icon: 32,
        titleVariant: 'h4',
        subtitleVariant: 'body1',

      },
      desktop4K: {
        button: 80,
        icon: 36,
        titleVariant: 'h3',
        subtitleVariant: 'h6',

      },
    }[breakname]
  }, [breakname])
  const { toggleNowPlaying } = useAppStore()
  const { track, playing, currentTime } = usePlayerStore()
  const coverUrl = useMemo(() => {
    return track?.coverUrl ?? track?.al?.picUrl ?? ''
  }, [track])
  const onClose = useCallback(() => {
    toggleNowPlaying(false)
  }, [])

  const maskColor = useMemo(() => {
    if (theme)
      return alpha(theme.palette.primaryContainer.main, 0.5)

    else
      return 'rgba(0 0 0, 0)'
  }, [theme])

  return <Box ref={ref} sx={{
    height: '100vh',
    outline: 'none',
    color: theme.palette.onPrimaryContainer.main,
  }}
  className='grid grid-cols-2'
  >
    <Box className='p-4 flex flex-col gap-4 items-center' sx={{
      bgcolor: alpha(theme.palette.primaryContainer.main, 0.5),
      color: theme.palette.onPrimaryContainer.main,
    }}
    >
      <Box className='overflow-hidden rounded-full drag-area' sx={{ height: '45vh', width: '100%' }}>
        <Image src={coverUrl} fit={'cover'}
               gradient={`linear-gradient(90deg, ${maskColor} 0%, rgb(0 0 0 / 0%) 50%, ${maskColor} 100%), linear-gradient(360deg, ${maskColor} 0%, rgb(0 0 0 / 0%) 50%, ${maskColor} 100%)`}
                />
      </Box>
      <Box className='flex flex-col gap-8 mb-2 mt-auto' sx={{ width: '70%' }}>
        <div className="flex flex-col justify-center items-center no-drag-area">
          <Typography variant={responsiveSize.titleVariant as 'caption'} className="font-weight-regular line-clamp-1">{ track?.name }</Typography>
          <Typography variant={responsiveSize.subtitleVariant as 'caption'} className='line-clamp-1'><ArtistLink artist={track?.ar} /></Typography>
        </div>
        <MdControl />
        <div className="flex flex-col items-center w-full gap-1 no-drag-area">
          <NowPlayingSlider className="track-slider" />
          <div className='ml-auto flex gap-x-1 items-center'>
            <Typography variant='subtitle2' className="flex justify-center" >{ formatDuring(currentTime * 1000) }</Typography>
            <Typography variant='subtitle2' className="flex justify-center" >/</Typography>
            <Typography variant='subtitle2' className="flex justify-center"  >{ formatDuring(track?.['dt']) }</Typography>
          </div>
          <div className='ml-auto'>
            <TrackMore track={track} />
          </div>
        </div>
      </Box>

    </Box>
    <Box
      sx={{
        bgcolor: alpha(theme.palette.tertiaryContainer.main, 0.5),
      }}
    >
      <div className='flex justify-end p-2 drag-area'>
        <IconButton
          className="no-drag-area"
          onClick={onClose}
          sx={{
            'color': theme.palette.primary.main,
            '&:hover': {
              bgcolor: alpha(theme.palette.primaryContainer.main, theme.palette.action.focusOpacity),
            },
          }}
        >
          <KeyboardArrowDown />
        </IconButton>
      </div>
      <Box sx={{
        maskImage: `linear-gradient(to bottom, transparent 0px, ${theme.palette.tertiaryContainer.main} 48px)`,
      }}>
        <Box
          className={'overflow-y-hidden'}
          sx={{
            color: theme.palette.onSurface.main,
            maxHeight: 'calc(100vh - 112px)',
            height: 'calc(100vh - 112px)',
            px: 4,
            maskImage: `linear-gradient(to top, transparent 0px, ${theme.palette.tertiaryContainer.main} 48px)`,
          }}
        >
          <NowPlayingLyric enable={true} />
        </Box>
      </Box>
    </Box>
  </Box>
})

export default MaterialYouStyle
