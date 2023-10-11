import { useQuery } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import { Button, IconButton, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { motion } from 'framer-motion'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { getDailyRecommend } from '@/api/user'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import TrackList from '@/components/TrackList'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import { usePlayer } from '@/hooks/usePlayer'
import usePlayQueue from '@/hooks/usePlayQueue'

function Header({
  data,
}: { data: any }) {
  const theme = useTheme()
  const [showImageView, setShowImageView] = useState(false)

  const { player } = usePlayer()
  const [loading, toggleLoading] = useState(false)
  const { addToQueueAndPlay } = usePlayQueue()
  const cover = data.dailySongs[0]?.al.picUrl

  function handlePlay() {
    toggleLoading(true)
    addToQueueAndPlay(data.dailySongs, 0, 'daily', '日推')
    toggleLoading(false)
  }

  return (
    <motion.div
      initial={{
        opacity: 0, transform: 'translateX(15px)',
      }}
      animate={{
        opacity: 1, transform: 'translateX(0px)',
      }}
      transition={{
        duration: 0.25,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div className="flex flex-col">
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '317px' }}>
          <Image
            className="absolute"
            src={cover}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          {
            cover &&
              <ImageViewer open={showImageView} src={cover} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1" onClick={() => setShowImageView(true)}></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">每日歌曲推荐</Typography>
              <div className="flex flex-col">
                <Typography variant="body1">
                   根据你的音乐口味生成，每天6:00更新
                </Typography>
              </div>
              <div className='flex gap-3'>
                <Button disableElevation variant='contained' sx={{
                  'bgcolor': `${theme.palette.primary.main}1f`,
                  'borderRadius': 6,
                  'px': 6,
                  'py': 1.5,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}38`,
                  },
                }} onClick={handlePlay}><PlayArrowIcon color='primary'/> </Button>
                <IconButton size='large' sx={{
                  bgcolor: `${theme.palette.tertiary.main}1f`,
                }}>
                  <MoreHorizIcon/>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
export default function DailyPage() {
  const { data, isLoading } = useQuery(['daily', 'tracks'], async () => {
    const { data } = await getDailyRecommend()
    return data
  })
  return <PageTransition>
    <Box>
      {
        isLoading ? <PlayListSkeleton/> : <Header data={data}  />
      }
      <Box className='h-4'></Box>
      {
        data?.dailySongs?.length && <TrackList tracks={data.dailySongs}/>
      }
    </Box>
  </PageTransition>
}
