import { Typography } from '@mui/material'
import { memo, useLayoutEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import { Lyric } from '@/hooks/useTrackOperation'

function LyricItemView({ highLight, lyric, translateY, onClick, onLoaded, animationDelay, animation }: {
  highLight?: boolean
  lyric: Lyric
  translateY?: number
  animation?: boolean
  animationDelay?: number
  onClick?: (idx: number) => void
  onLoaded?: (lyric: Lyric) => void
}) {
  const ref = useRef<HTMLDivElement>()
  const [height, setHeight] = useState(0)
  const theme = useTheme()

  useLayoutEffect(() => {
    const info = ref.current.getBoundingClientRect()
    setHeight(info.height)
    onLoaded?.({ ...lyric, height: info.height })
  }, [lyric])
  return <Box
    onClick={() => onClick(lyric.index)}
    ref={ref}
    className='cursor-pointer'
    current-time={lyric.time}
    current-height={height}
    sx={{
      'py': 1.5,
      'px': 1,
      'borderRadius': 2,
      'color': highLight ? theme.palette.onTertiaryContainer.main : 'inherit',
      '&:hover': {
        color:theme.palette.onTertiaryContainer.main,
        bgcolor: alpha(theme.palette.primaryContainer.main, theme.palette.action.focusOpacity),
      },
    }}
    style={{
      transform: `translateY(${-translateY || 0}px)`,
      transitionProperty: 'transform',
      transitionDelay: `${animationDelay || 0}ms`,
      transitionTimingFunction: 'ease-in-out',
      transitionDuration: '650ms',
    }}
  >
    <Typography
      variant='h6'
      dangerouslySetInnerHTML={{
        __html: lyric.sentence,
      }}
      />
  </Box>
}

export default memo(LyricItemView)
