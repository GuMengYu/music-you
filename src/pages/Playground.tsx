import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'

const testMusicUrl = 'file:///Users/yoda/Downloads/G.E.M.邓紫棋 - 唯一.mp3'
export default function Playground() {



  return <PageTransition>
    <Box>
      <video controls>
        <source src={testMusicUrl} />
      </video>
    </Box>
  </PageTransition>
}
