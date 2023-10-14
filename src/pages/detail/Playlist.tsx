import { Box, Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useCopyToClipboard } from 'react-use'
import { useSnackbar } from 'notistack'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import TrackList from '@/components/TrackList'
import useQueryPlaylist, { useQueryPlaylistTracks } from '@/pages/detail/useQueryPlaylist'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import { formatDate, formatDuring, formatNumber } from '@/util/fn'
import type { Playlist } from '@/types'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import usePlayQueue from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import { sub } from '@/api/music'
import { deletePlayList } from '@/api/playlist'
import TrackListSkeleton from '@/components/skeleton/TrackListSkeleton'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'

const PlayListHeader = memo(({ playlist, onPlay }: { playlist: Playlist | undefined; onPlay: () => void }) => {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const tracksDt = playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)

  const { openContextMenu } = useContextMenu()
  const { isCreatedPlaylist } = useMyPlaylist()
  const [subscribed, setSubscribed] = useState(false)
  const [copied, copyToClipboard] = useCopyToClipboard()

  useEffect(() => {
    setSubscribed(playlist.subscribed)
  }, [playlist])

  async function subscribe() {
    const { code, message } = await sub('playlist', playlist.id, subscribed ? 0 : 1)
    if (code === 200) {
      enqueueSnackbar(`${subscribed ? '已从音乐库移除' : '已添加到音乐库'}`, { variant: 'success' })
      setSubscribed(!subscribed)
    }
    else {
      enqueueSnackbar(message, { variant: 'error' })
    }
  }
  async function del() {
    const { code, message } = await deletePlayList(playlist.id)
    if (code === 200)
      enqueueSnackbar('已删除', { variant: 'success' })
    else
      enqueueSnackbar(message, { variant: 'error' })

  }
  function handleMore(e: React.MouseEvent<HTMLElement>) {
    const items = [
      ...(!isCreatedPlaylist(playlist) && subscribed ? [
        {
          type: 'item' as any,
          label: '从音乐库中移除',
          onClick: () => {
            subscribe()
          },
        },
      ] : []),
      ...(!isCreatedPlaylist(playlist) && !subscribed ? [
        {
          type: 'item' as any,
          label: '添加到音乐库',
          onClick: () => {
            subscribe()
          },
        },
      ] : []),
      ...(isCreatedPlaylist(playlist) ? [
        {
          type: 'item' as any,
          label: '编辑歌单',
          onClick: () => {
            enqueueSnackbar('待开发...', { variant: 'warning' })
          },
        },
        {
          type: 'item' as any,
          label: '删除歌单',
          onClick: () => {
            del()
          },
        },
        { type: 'divider' as any },
      ] : []),
      {
        type: 'item',
        label: '复制网页分享链接',
        onClick: () => {
          copyToClipboard(`https://music.163.com/#/playlist?id=${playlist.id}`)
          enqueueSnackbar('已复制分享链接到粘贴板', { variant: 'success' })
        },
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
                }} onClick={onPlay}><PlayArrowIcon color='primary'/> </Button>
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
})
export default function PlaylistPage() {
  const { addToQueueAndPlay } = usePlayQueue()

  const params = useParams()
  const { data, isLoading } = useQueryPlaylist(params.id)
  const { isCreatedPlaylist, isMyPlaylist } = useMyPlaylist()
  const isMyList = useMemo(() => {
    if (data?.playlist)
      return isMyPlaylist(data.playlist)

  }, [data])
  // isMyList 用户创建的歌单需要请求最新的数据
  const { tracks, isLoading: isLoadingList } = useQueryPlaylistTracks(data?.playlist.id, isMyList)
  const handlePlay = useCallback(() => {
    addToQueueAndPlay(tracks, data.playlist.id, 'playlist', data.playlist.name)
  }, [tracks, data])
  return (
    <PageTransition>
      <Box className='pr-2'>
        {
          isLoading ? <PlayListSkeleton/> : <PlayListHeader playlist={data?.playlist} onPlay={handlePlay}/>
        }
        <Box className='h-4'></Box>
        {
          isLoadingList ? <TrackListSkeleton /> : <TrackList tracks={tracks} source={data?.playlist && {
            playlist: data.playlist,
            type: 'playlist',
            own: isCreatedPlaylist(data.playlist),
          }} />
        }
        <Box className='h-4'></Box>
        <Col variant='h6' title='相似歌单'>
          <GridRow singleLine>
            {
              data?.relatedPlaylists?.map((i) => {
                return <Cover data={i} key={i.id} type='playlist' />
              })
            }
          </GridRow>
        </Col>
      </Box>
    </PageTransition>

  )
}
