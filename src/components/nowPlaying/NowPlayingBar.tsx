import {Box, Slider, Toolbar, Typography} from "@mui/material";
import Image from "@/components/Image";
import {usePlayerControl} from "@/hooks/usePlayer";
import {sizeOfImage} from "@/util/fn";
import {styled, useTheme} from "@mui/material/styles";
import ArtistLink from "@/components/links/artist";
import NowPlayingSlider from "@/components/nowPlaying/NowPlayingSlider";
import PlayToggle from "../toggle/PlayToggle";

function NowPlayingBar() {
  const theme = useTheme()
  const {track} = usePlayerControl()
  const coverUrl = sizeOfImage(track?.coverUrl ?? track?.al?.picUrl ?? '', 256)
  const trackDt = track?.dt ?? track?.duration ?? 0
  return (
    <Box component='footer' sx={{
      bgcolor: theme.palette.surface.main,
      color: theme.palette.onSurface.main,
      px: 1,
      height: 72,
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
    }}>
      <div className='flex w-full h-full'>
        <NowPlayingSlider sx={{position: 'absolute', top: -13, width: 'calc(100% - 12px)', margin: '0 2px'}}/>
        <div className='flex flex-1 items-center gap-4'>
          <Box sx={{
            height: 56,
            width: 56,
            minWidth: 56,
            minHeight: 56,
            borderRadius: 3.5,
            overflow: 'hidden',
          }}>
            <Image src={coverUrl} className="absolute"></Image>
          </Box>
          <div className='flex flex-col justify-center'>
            <Typography className='line-clamp-1' variant='subtitle1'>{track?.name}</Typography>
            {track?.ar?.length && (<Typography className='line-clamp-1' variant='caption'>
              <ArtistLink artist={track?.ar}/>
            </Typography>)}

          </div>
        </div>
        <div className='flex flex-1'>
          <PlayToggle />
        </div>
        <div className='flex flex-1 items-center justify-end'>

        </div>
      </div>
    </Box>

  )
}

export default NowPlayingBar
