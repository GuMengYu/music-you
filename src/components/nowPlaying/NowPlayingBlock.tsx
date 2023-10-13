import { IconButton, Paper } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SkipPreviousIcon from '@mui/icons-material/SkipPreviousOutlined'
import SkipNextIcon from '@mui/icons-material/SkipNextOutlined'
import { motion } from 'framer-motion'
import { PauseRoundedIcon, PlayRoundedIcon } from '@/components/icons/icons'
import { usePlayerStore } from '@/store/player'
import MotionImage from '@/components/Image'
import { hexToRgb } from '@/util/fn'
import { generateMUITheme } from '@/plugins/theme'
import LikeToggle from '@/components/toggle/likeToggle'
import { usePlayer } from '@/hooks/usePlayer'
import NowPlayingSlider from '@/components/nowPlaying/NowPlayingSlider'

export default function NowPlayingBlock() {
  const cardRef = useRef()
  const { track, playing } = usePlayerStore()
  const { player } = usePlayer()
  const [colorPalette, setColorPalette] = useState<Record<string, string>>()
  const cover = track?.al?.picUrl

  const maskColor = useMemo(() => {
    if (colorPalette) {
      const { primary } = colorPalette
      return `rgba(${hexToRgb(primary)}, 0.7)`
    }
    else {
      return 'rgba(0 0 0, 0)'
    }
  }, [colorPalette])

  useEffect(() => {
    initColorPalette()
  }, [cover])
  function openContextMenu() {

  }
  async function initColorPalette() {
    if (cover) {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = cover
      const mdTheme = await generateMUITheme(image, 'Palette')
      setColorPalette(mdTheme.palette.light)
    }
  }

  function PlayToggle() {
    return (
      <IconButton
        onClick={() => player.togglePlay()}
        sx={{
          height: 68,
          width: 68,
        }}
      >
        {
          playing ? <PauseRoundedIcon sx={{ fontSize: 48 }} color={'primary'} /> : <PlayRoundedIcon sx={{ fontSize: 48 }}  fontSize='large' color='primary' />
        }
      </IconButton>
    )
  }
  return <motion.div className='cursor-grab'
                     drag
                     dragMomentum={false}
                     whileDrag={{ scale: 1.02 }}
  >
    <Paper className='flex flex-col no-drag-area' elevation={24} ref={cardRef} sx={{
      height: 140,
      width: 140,
      position: 'absolute',
      zIndex: 9999,
      borderRadius: 4,
      overflow: 'hidden',
      bottom: 12,
      right: 12,
    }}>
    <div className='absolute'>
      <MotionImage src={cover} gradient={`linear-gradient(90deg, ${maskColor} 0%, ${maskColor} 100%)`} />
    </div>

    <div className="flex flex-col justify-between h-full p-1">
      <div className="flex justify-between">
        <LikeToggle size='small' id={track.id} />
        <IconButton sx={{
          height: 28,
          width: 28,
        }} size='small' onClick={openContextMenu}>
          <MoreHorizIcon fontSize='small'/>
      </IconButton>
      </div>
      <div className="flex justify-center flex-col items-center">
        <PlayToggle />
      </div>
      <div className="flex justify-between items-center gap-2">
        <IconButton sx={{
          height: 28,
          width: 28,
        }} size='small' onClick={() => player.prev()}>
          <SkipPreviousIcon fontSize='small'/>
        </IconButton>
        <NowPlayingSlider />
        <IconButton sx={{
          height: 28,
          width: 28,
        }} size='small' onClick={() => player.next()}>
          <SkipNextIcon fontSize='small'/>
        </IconButton>
      </div>
    </div>
  </Paper>
    </motion.div>
}
