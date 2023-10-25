import { Box, Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import { useSnackbar } from 'notistack'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import { formatDate, formatNumber } from '@/util/fn'
import type { Podcast } from '@/types'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import usePlayQueue from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { sub } from '@/api/music'
import useQueryPodcast from '@/pages/detail/useQueryPodcast'
import ProgramList from '@/pages/podcast/ProgramList'

function PodcastHeader({ podcast }: { podcast: Podcast }) {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const { addToQueueAndPlay } = usePlayQueue()
  const { openContextMenu } = useContextMenu()
  const [subscribed, setSubscribed] = useState(false)
  const [copied, copyToClipboard] = useCopyToClipboard()

  useEffect(() => {
    setSubscribed(podcast.subed)
  }, [podcast])

  function handlePlay() {
    addToQueueAndPlay(podcast.programs, podcast.id, 'program', podcast.name)
  }

  async function subscribe() {
    const { code, message } = await sub('podcast', podcast.id, subscribed ? 0 : 1)
    if (code === 200) {
      enqueueSnackbar(`${subscribed ? '已从音乐库移除' : '已添加到音乐库'}`, { variant: 'success' })
      setSubscribed(!subscribed)
    }
    else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }
  function handleMore(e: React.MouseEvent<HTMLElement>) {
    const items = [
      ...(subscribed
        ? [
            {
              type: 'item' as any,
              label: '取消订阅',
              onClick: () => {
                subscribe()
              },
            },
          ]
        : [
            {
              type: 'item' as any,
              label: '订阅收听播客',
              onClick: () => {
                subscribe()
              },
            },
          ]),
      {
        type: 'item' as any,
        label: '查看封面',
        onClick: () => {
          setShowImageView(true)
        },
      },
      {
        type: 'item',
        label: '复制网页分享链接',
        onClick: () => {
          copyToClipboard(`https://music.163.com/#/djradio?id=${podcast.id}`)
          enqueueSnackbar('已复制分享链接到粘贴板', { variant: 'success' })
        },
      },
    ]
    openContextMenu(e, items)
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
            src={podcast?.picUrl}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          {
            podcast?.picUrl
              && <ImageViewer open={showImageView} src={podcast?.picUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{podcast?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1" color='primary'>
                  {podcast?.['dj']?.nickname}
                </Typography>
                <Typography variant="caption">
                  {formatDate(podcast?.createTime, 'LL')}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {podcast?.['programCount']}
                  </Typography>
                  <Typography variant="caption">节目</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">播客</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center pl-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {podcast?.subCount ? formatNumber(podcast?.subCount) : 0}
                  </Typography>
                  <Typography variant="caption">订阅</Typography>
                </div>
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
                }} onClick={handleMore}>
                  <MoreHorizIcon/>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {
          podcast?.desc && <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <Typography variant='body1'>播客简介</Typography>
                <IconButton onClick={() => setShowDesc(true)}>
                  <ArrowForwardIcon/>
                </IconButton>
              </div>
            </div>
            <Md3Dialog fullWidth maxWidth='xs' open={showDesc} onClose={() => setShowDesc(false)}>
              <DialogTitle variant='body1'>播客简介</DialogTitle>
              <DialogContent>
                <Typography variant='caption'>{podcast.desc}</Typography>
              </DialogContent>
            </Md3Dialog>
          </>
        }
      </div>
    </motion.div>
  )
}
export default function PodcastDetail() {
  const params = useParams()
  const { data, isLoading } = useQueryPodcast(params.id)
  return (
    <PageTransition>
      {isLoading}
      <Box className='pr-2'>
        {
          isLoading ? <PlayListSkeleton/> : <PodcastHeader podcast={data?.podcast}/>
        }
        <Box className='h-4'></Box>
        {
          data?.programs && <ProgramList programs={data.programs} podcast={data.podcast} />
        }
      </Box>
    </PageTransition>

  )
}
