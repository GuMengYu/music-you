import Modal from '@mui/material/Modal'
import {Box, IconButton, Typography, useTheme} from "@mui/material";
import {useAppStore} from "@/store/app";
import React, {useEffect, useMemo} from "react";
import {css, cx} from "@emotion/css";
import {playQueueStore} from "@/store/playQueue";
import {Track} from "@/types";
import {sizeOfImage} from "@/util/fn";
import ArtistLink from "@/components/links/artist";
import {Virtuoso} from 'react-virtuoso'
import {useWindowSize} from "react-use";
import CloseIcon from "@mui/icons-material/Close";
import Wave from "@/components/Wave";
import Fade from '@mui/material/Fade';
import {usePlayerControl} from "@/hooks/usePlayer";

const TrackItem = ({
                     track,
                     index,
                   }: {
  track?: Track
  index: number
}) => {
  const {playing, track: playingTrack} = usePlayerControl()
  const isPlaying = track?.id === playingTrack?.id
  const theme = useTheme()
  return (
    <div
      className='mb-5 flex items-center justify-between cursor-pointer'
      onClick={e => {
        if (e.detail === 2 && track?.id) {
          console.log('play track')
        }
      }}
      onContextMenu={event => {
        if (track?.id) {
          console.log('play track')
        }
      }}
    >
      {/* Cover */}
      <img
        alt='Cover'
        className='mr-4 aspect-square h-14 w-14 flex-shrink-0 rounded-xl'
        src={sizeOfImage(track?.al?.picUrl || '',)}
      />

      {/* Track info */}
      <div className='flex-grow'>
        <Typography className='line-clamp-1' variant='body1'
                    color={isPlaying ? 'primary' : ''}>{track?.name}</Typography>
        <Typography variant='body2'> {track?.ar && <ArtistLink artist={track?.ar}/>}</Typography>
      </div>

      {isPlaying ? (
        <Wave animate={playing}/>
      ) : (
        <Typography variant='body1'>
          {String(index + 1).padStart(2, '0')}
        </Typography>
      )}
    </div>
  )
}
const TrackList = () => {
  const {queue} = playQueueStore()
  const {height: windowHeight} = useWindowSize()
  const theme = useTheme()
  const listHeight = windowHeight - 150 // padding 150
  return <div
    className={cx('w-full', css`
      mask-image: linear-gradient(to bottom, transparent 22px, ${theme.palette.primary.main} 48px);
    `)}
  >
    <Virtuoso
      className={
        cx('hide-scrollbar', css`
          mask-image: linear-gradient(to top, transparent 8px, ${theme.palette.primary.main} 48px);
        `)
      }
      style={
        {
          height: `${listHeight}px`
        }
      }
      itemContent={(idx, track) => {
        return <TrackItem key={track.id} track={track} index={idx}></TrackItem>
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
const NowPlayingList = () => {
  const {showNowPlayingList, toggleNowPlayingList} = useAppStore()
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
        outline: 'none'
      },
      '& .MuiModal-backdrop': {
        backdropFilter: 'blur(100px)',
        borderRadius: '28px',
      }
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
              bgcolor: `${theme.palette.primary.main}36`
            }} size='large'><CloseIcon/></IconButton>
          </div>
        </Box>
      </Fade>
    </Modal>)
}
export default NowPlayingList
