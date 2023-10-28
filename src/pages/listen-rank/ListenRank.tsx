import { useQuery } from '@tanstack/react-query'
import { Button, Typography, useTheme } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { motion } from 'framer-motion'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useState } from 'react'
import Box from '@mui/material/Box'
import { fetchPlayRecord } from '@/api/user'
import PageTransition from '@/components/PageTransition'
import usePlayQueue from '@/hooks/usePlayQueue'
import Image from '@/components/Image'
import { useUserStore } from '@/store/user'
import RecordTrackList from '@/pages/listen-rank/RecordTrackList'

export default function ListenRank() {
  const { account } = useUserStore()

  const { data } = useQuery(['listen', 'rank'], async () => {
    const { weekData, allData } = await fetchPlayRecord(account.account.id)
    return {
      weekData,
      allData,
    }
  })
  const theme = useTheme()
  const { addToQueueAndPlay } = usePlayQueue()
  const [value, setValue] = useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  function handlePlay() {
    const tracks = value === 0 ? data.weekData.map(i => i.song) : data.allData.map(i => i.song)
    if (tracks?.length)
      addToQueueAndPlay(tracks)
  }

  return <PageTransition>
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
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '256px' }}>
          <Image
            className="absolute"
            src={'https://cdn.dribbble.com/userupload/9980403/file/original-c02f32591b70a31916dcff4894e6225d.jpg?resize=752x'}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className='flex-1'></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">我的听歌排行</Typography>
              <div className="flex flex-col">
                <Typography variant="caption">
                  统计每周和全部时间的听歌次数，实际播放时间过短的歌曲将不纳入计算
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
              </div>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
    <div className='flex flex-col pr-2'>
      <Tabs className='self-start' value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="最近一周" value={0} />
        <Tab label="所有时间" value={1} />
      </Tabs>
      <Box className='overflow-y-auto my-2 h-full hide-scrollbar'>
        <CustomTabPanel value={value} index={0}  >
          {
            data?.weekData?.length && <RecordTrackList records={data?.weekData} />
          }
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}  >
          {
            data?.allData?.length && <RecordTrackList records={data?.allData} />
          }
        </CustomTabPanel>
      </Box>
    </div>

  </PageTransition>
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
