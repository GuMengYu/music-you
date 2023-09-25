import { Box, Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import TrackList from '@/components/TrackList'
import useQueryPlaylist from '@/pages/detail/useQueryPlaylist'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import { formatDate, formatDuring, formatNumber } from '@/util/fn'
import type { Playlist } from '@/types'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import usePlayQueue from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useMyPlaylist } from '@/hooks/usePlaylist'

function PlayListHeader({ playlist }: { playlist: Playlist | undefined }) {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
  const tracksDt = playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)

  const { addToQueueAndPlay } = usePlayQueue()
  const { openContextMenu } = useContextMenu()
  const { isCreatedPlaylist } = useMyPlaylist()
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setSubscribed(playlist.subscribed)
  }, [playlist])

  function handlePlay() {
    addToQueueAndPlay(playlist.tracks, playlist.id, 'playlist', playlist.name)
  }
  function handleMore(e: React.MouseEvent<HTMLElement>) {
    const items = [
      {
        type: 'item',
        label: '下一首播放',
        onClick: () => {

        },
      },
      { type: 'divider' as any },
      ...(!isCreatedPlaylist(playlist) && subscribed ? [
        {
          type: 'item' as any,
          label: '从音乐库中移除',
          onClick: () => {

          },
        },
      ] : []),
      ...(!isCreatedPlaylist(playlist) && !subscribed ? [
        {
          type: 'item' as any,
          label: '添加到音乐库',
          onClick: () => {

          },
        },
      ] : []),
      ...(isCreatedPlaylist(playlist) ? [
        {
          type: 'item' as any,
          label: '编辑歌单',
          onClick: () => {

          },
        },
        {
          type: 'item' as any,
          label: '删除歌单',
          onClick: () => {

          },
        },
      ] : []),
      { type: 'divider' },
      {
        type: 'item',
        label: '复制网页分享链接',
        onClick: () => {},
      },
    ]
    openContextMenu(e,  items)
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
            src={playlist?.coverImgUrl}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          {
            playlist?.coverImgUrl &&
              <ImageViewer open={showImageView} src={playlist?.coverImgUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1" onClick={() => setShowImageView(true)}></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{playlist?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant="body1" color='primary'>
                  {playlist?.['creator']?.nickname}
                </Typography>
                <Typography variant="caption">
                  {formatDate(playlist?.createTime, 'LL')}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center pr-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {playlist?.['trackCount']}
                  </Typography>
                  <Typography variant="caption">首</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">歌单</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {formatDuring(tracksDt)}
                  </Typography>
                  <Typography variant="caption">时长</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center pl-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">
                    {playlist?.playCount ? formatNumber(playlist?.['playCount']) : 0}
                  </Typography>
                  <Typography variant="caption">次</Typography>
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
          playlist?.description && <>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                <Typography variant='body1'>歌单简介</Typography>
                <IconButton onClick={() => setShowDesc(true)}>
                  <ArrowForwardIcon/>
                </IconButton>
              </div>
            </div>
            <Md3Dialog fullWidth maxWidth='xs' open={showDesc} onClose={() => setShowDesc(false)}>
              <DialogTitle variant='body1'>歌单简介</DialogTitle>
              <DialogContent>
                <Typography className='line-clamp-3' variant='caption'>{playlist['description']}</Typography>
              </DialogContent>
            </Md3Dialog>
          </>
        }
      </div>
    </motion.div>
  )
}
export default function PlaylistPage() {
  const params = useParams()
  const theme = useTheme()
  const { data, isLoading } = useQueryPlaylist(params.id)
  const { isCreatedPlaylist } = useMyPlaylist()
  return (
    <PageTransition>
      {isLoading}
      <Box  sx={{ color: theme.palette.onSurface.main }}>
        {
          isLoading ? <PlayListSkeleton/> : <PlayListHeader playlist={data?.playlist}/>
        }
        <Box className='h-4'></Box>
        {
          data?.tracks && <TrackList tracks={data.tracks} source={{
            type: 'playlist',
            own: isCreatedPlaylist(data.playlist),
          }} />
        }
      </Box>
    </PageTransition>

  )
}
