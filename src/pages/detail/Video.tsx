import { Box, Button, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useCopyToClipboard } from 'react-use'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import Image from '@/components/Image'
import ArtistLink from '@/components/links/artist'
import { useContextMenu } from '@/hooks/useContextMenu'
import useQueryVideo from '@/pages/detail/useQueryVideo'
import { formatDate, formatDuring, formatNumber, toHttps } from '@/util/fn'
import GridRow from '@/components/GridRow'
import VideoCover from '@/components/cover/VideoCover'
import Col from '@/components/Col'
import VideoViewer from '@/components/VideoViewer'
import { getMvUrl } from '@/api/mv'
import { usePlayer } from '@/hooks/usePlayer'
import { usePlayerStore } from '@/store/player'

function Header({ data, onPlay }: { data: any | undefined; onPlay: () => void }) {
  const theme = useTheme()

  const { openContextMenu } = useContextMenu()
  const { enqueueSnackbar } = useSnackbar()
  const [copied, copyToClipboard] = useCopyToClipboard()

  const [subscribed, setSubscribed] = useState(false)
  function handleMore(e: React.MouseEvent<HTMLElement>) {
    openContextMenu(e, [
      ...(subscribed ? [
        {
          type: 'item' as any,
          label: '从音乐库中移除',
          onClick: () => {

          },
        },
      ] : [
        {
          type: 'item' as any,
          label: '收藏视频',
          onClick: () => {

          },
        },
      ]),
      { type: 'divider' },
      {
        type: 'item',
        label: '复制网页分享链接',
        onClick: () => {
          copyToClipboard(`https://music.163.com/#/playlist?id=${data.id}`)
          enqueueSnackbar('已复制分享链接到粘贴板', { variant: 'success' })
        },
      },
    ] )
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
            src={data.cover}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
            <div className="flex flex-col mx-3 mb-4 gap-3">
              <Typography variant="h4">{data.name}</Typography>
              <div className="flex flex-col gap-1">
                <Typography variant="subtitle2">
                  {data.desc}
                </Typography>
                <Typography variant="caption">
                  {formatDate(data.publishTime, 'LL')} · { formatDuring(data.duration)} · {formatNumber(data.playCount ?? 0)}
                </Typography>
                <Typography variant="caption" color='primary'>
                  <ArtistLink artist={data.artists} />
                </Typography>
              </div>

              <div className='flex gap-3'>
                <Button disableElevation variant='contained' sx={{
                  'bgcolor': `${theme.palette.primary.main}1f`,
                  'color': theme.palette.primary.main,
                  'borderRadius': 2,
                  'px': 2,
                  'py': 1.5,
                  '&:hover': {
                    bgcolor: `${theme.palette.primary.main}38`,
                  },
                }} onClick={onPlay}><PlayArrowIcon color='primary'/> Watch Now </Button>
                <IconButton size='large' sx={{
                  bgcolor: `${theme.palette.tertiary.main}1f`,
                }} onClick={handleMore}>
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
export default function VideoPage() {
  const params = useParams()
  const theme = useTheme()
  const { data, isLoading } = useQueryVideo(params.id)
  const { player } = usePlayer()
  const { playing } = usePlayerStore()

  const [openViewer, setOpenViewer] = useState(false)
  const [canPlayUrl, setCanPlayUrl] = useState('')

  const handlePlay = useCallback(async () => {
    // 暂停音乐播放
    if (playing)
      player.pause()

    const { data: urlData } = await getMvUrl({ id: data.video.id, r: 1080 })
    setCanPlayUrl(toHttps(urlData.url))
    setOpenViewer(true)
  }, [data])
  return (
    <PageTransition>
      <Box className='pr-2'>
        {
          isLoading ? <PlayListSkeleton/> : <Header data={data?.video} onPlay={handlePlay}/>
        }
        <Box className='h-4'></Box>
        <Col title='相似推荐' variant='h6'>
          <GridRow>
            {
              data?.relatedVideo?.map((i) => {
                return <VideoCover key={i.id} data={i} />
              })
            }
          </GridRow>
        </Col>
        <VideoViewer title={data?.video.name} src={canPlayUrl} cover={data?.video.cover} open={openViewer} onClose={() => {
          setCanPlayUrl(null)
          setOpenViewer(false)
        }} />
      </Box>
    </PageTransition>

  )
}
