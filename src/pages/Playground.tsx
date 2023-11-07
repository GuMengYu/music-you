import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'
import NowPlayingLyric from '@/components/nowPlaying/NowPlayingLyric'

export default function Playground() {



  return <PageTransition>
    <Box sx={{
      maxWidth: 400,
      maxHeight: 450,
      overflowY: 'auto',
    }}>
    <NowPlayingLyric enable={true} />
    </Box>
  </PageTransition>
}
