import Modal from '@mui/material/Modal'
import { Box, IconButton, Typography, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { css, cx } from '@emotion/css'
import type { VirtuosoHandle } from 'react-virtuoso'
import { Virtuoso } from 'react-virtuoso'
import { useWindowSize } from 'react-use'
import CloseIcon from '@mui/icons-material/Close'
import Fade from '@mui/material/Fade'
import { useAppStore } from '@/store/app'
import { playQueueStore } from '@/store/playQueue'
import type { Track } from '@/types'
import { sizeOfImage } from '@/util/fn'
import ArtistLink from '@/components/links/artist'
import Wave from '@/components/Wave'
import { usePlayerControl } from '@/hooks/usePlayer'

function TrackItem({
  track,
  index,
  isCurrentPlaying,
  playing,
}: {
  track?: Track
  index: number
  playing: boolean
  isCurrentPlaying: boolean
}) {
  const theme = useTheme()
  return (
    <div
      className='mb-4 flex items-center justify-between cursor-pointer h-14'
      onClick={(e) => {
        if (e.detail === 2 && track?.id)
          console.log('play track')

      }}
      onContextMenu={(event) => {
        if (track?.id)
          console.log('play track')

      }}
    >
      {/* Cover */}
      {
        track?.al?.picUrl && <img alt='Cover' className='mr-4 aspect-square h-14 w-14 flex-shrink-0 rounded-xl' src={sizeOfImage(track?.al?.picUrl || '')}
          />
      }


      {/* Track info */}
      <div className='flex-grow'>
        <Typography className='line-clamp-1' variant='body1'
          color={isCurrentPlaying ? 'primary' : ''}>{track?.name}</Typography>
        <Typography variant='body2'> {track?.ar && <ArtistLink artist={track?.ar}/>}</Typography>
      </div>

      {isCurrentPlaying ? (
        <Wave animate={playing}/>
      ) : (
        <Typography variant='body1'>
          {String(index + 1).padStart(2, '0')}
        </Typography>
      )}
    </div>
  )
}
function TrackList() {
  const { queue } = playQueueStore()
  const { track: playingTrack, playing, playingIndex } = usePlayerControl()
  const { height: windowHeight } = useWindowSize()
  const virtuoso = useRef<VirtuosoHandle | null>(null)
  const theme = useTheme()
  const listHeight = windowHeight - 150 // padding 150
  const [currentRange, setCurrentRange] = useState({
    startIndex: 0,
    endIndex: 0,
  })
  const [animateScroll, setAnimateScroll] = useState(false)
  useEffect(() => {
    if (!playingIndex)
      return
    // todo need to scroll to position
    const offset = -3 // todo 需计算

    // not in view range
    if (playingIndex < currentRange.startIndex || playingIndex > currentRange.endIndex) {

      const toIndex = playingIndex + offset
      setTimeout(() => {
        virtuoso.current?.scrollToIndex({
          index: toIndex,
          align: 'start',
          behavior: animateScroll ? 'smooth' : undefined,
        })
        setAnimateScroll(true)

      }, 0)
    }
  }, [playingTrack])
  return <div
    className={cx('w-full', css`
      mask-image: linear-gradient(to bottom, transparent 22px, ${theme.palette.primary.main} 48px);
    `)}
  >
    <Virtuoso
      ref={virtuoso}
      rangeChanged={setCurrentRange}
      className={
        cx('hide-scrollbar', css`
          mask-image: linear-gradient(to top, transparent 8px, ${theme.palette.primary.main} 48px);
        `)
      }
      style={
        {
          height: `${listHeight}px`,
        }
      }
      itemContent={(idx, track) => {
        return <TrackItem
          key={track.id}
          track={track}
          index={idx}
          isCurrentPlaying={playingIndex === idx}
          playing={playing}
        ></TrackItem>
      }}
      data={queue.tracks}
      totalCount={queue.tracks.length}
      fixedItemHeight={72}
      overscan={10}
      components={{
        Header: () => <div className='h-8'></div>,
        Footer: () => <div className='h-8'></div>,
      }}
    >

    </Virtuoso>
  </div>
}
function NowPlayingList() {
  const { showNowPlayingList, toggleNowPlayingList } = useAppStore()
  const theme = useTheme()

  const onClose = () => {
    toggleNowPlayingList(false)
  }
  // useEffect(() => {
  //   if (showNowPlayingList) {
  //     console.log('open now playing list')
  //   }
  // }, [showNowPlayingList]);
  return (
    <Modal open={showNowPlayingList} onClose={onClose} sx={{
      '&:focus-visible': {
        outline: 'none',
      },
      '& .MuiModal-backdrop': {
        backdropFilter: 'blur(100px)',
        borderRadius: '28px',
      },
    }}>
      <Fade in={showNowPlayingList}>
        <Box sx={{
          color: theme.palette.onSurface.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          outline: 'none',
        }}>
          <div className='flex flex-col items-center w-1/2 relative'>
            <TrackList/>
            <IconButton onClick={onClose} sx={{
              mt: 3,
              bgcolor: `${theme.palette.primary.main}36`,
            }} size='large'><CloseIcon/></IconButton>
          </div>
        </Box>
      </Fade>
    </Modal>)
}
export default NowPlayingList
