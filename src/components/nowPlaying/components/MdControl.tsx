import { IconButton } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import SkipPreviousIcon from '@mui/icons-material/SkipPreviousOutlined'
import SkipNextIcon from '@mui/icons-material/SkipNextOutlined'
import { useMemo } from 'react'
import { PauseRoundedIcon, PlayRoundedIcon } from '@/components/icons/icons'
import { player } from '@/contexts/player'
import { useSematicBreakPoint } from '@/hooks/useBreakpoint'
import { usePlayerStore } from '@/store/player'

export default function MdControl() {
  const theme = useTheme()
  const { breakname } = useSematicBreakPoint()
  const { track, playing } = usePlayerStore()

  const responsiveSize = useMemo(() => {
    return {
      xxs: {
        button: 48,
        icon: 24,
        radius: 20,
      },
      xs: {
        button: 48,
        icon: 24,
        radius: 20,

      },
      sm: {
        button: 48,
        icon: 24,
        radius: 20,

      },
      md: {
        button: 48,
        icon: 24,
        radius: 20,

      },
      lg: {
        button: 64,
        icon: 30,
        radius: 24,

      },
      xl: {
        button: 64,
        icon: 30,
        radius: 24,
      },
      xll: {
        button: 72,
        icon: 32,
        radius: 28,
      },
      desktop4K: {
        button: 80,
        icon: 36,
        radius: 30,
      },
    }[breakname]
  }, [breakname])
  return  <div className='flex justify-evenly items-center no-drag-area w-full'>
    <IconButton
      onClick={() => player.prev()}
      sx={{
        'height': responsiveSize.button,
        'width': responsiveSize.button,
        'p': 0,
        'bgcolor': theme.palette.tertiaryContainer.main,
        'color': theme.palette.onTertiaryContainer.main,
        'borderRadius': '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.tertiaryContainer.main, 0.6),
        },
      }}
    >
      <SkipPreviousIcon sx={{ fontSize: responsiveSize.icon }} />
    </IconButton>
    <IconButton
      onClick={() => player.togglePlay()}
      sx={{
        'height': responsiveSize.button * 1.3,
        'width': responsiveSize.button * 1.3,
        'p': 0,
        'bgcolor': theme.palette.primaryContainer.main,
        'color': theme.palette.onPrimaryContainer.main,
        'borderRadius': playing ? `${responsiveSize.radius}px` : '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.primaryContainer.main, 0.6),
        },
      }}
    >
      {
        playing ? <PauseRoundedIcon  sx={{ fontSize: responsiveSize.icon }} /> : <PlayRoundedIcon   sx={{ fontSize: responsiveSize.icon }}/>
      }
    </IconButton>
    <IconButton
      onClick={() => player.next()}
      sx={{
        'height': responsiveSize.button,
        'width': responsiveSize.button,
        'p': 0,
        'bgcolor': theme.palette.tertiaryContainer.main,
        'color': theme.palette.onTertiaryContainer.main,
        'borderRadius': '50%',
        'transition': 'background-color, border-radius 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        '&:hover': {
          bgcolor: alpha(theme.palette.tertiaryContainer.main, 0.6),
        },
      }}
    >
      <SkipNextIcon sx={{ fontSize: responsiveSize.icon }} />
    </IconButton>
  </div>
}
