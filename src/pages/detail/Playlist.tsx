
// components
import { Virtuoso } from 'react-virtuoso'
import { useNavigate, useParams } from 'react-router-dom'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useCopyToClipboard, useWindowSize } from 'react-use'
import { useSnackbar } from 'notistack'
import { Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Box from '@mui/material/Box'
import PageTransition from '@/components/PageTransition'
import ImageViewer from '@/components/ImageViewer'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import { Track } from '@/components/TrackList'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'

// hooks
import { useQueryPlaylist, useQueryRelatedPlaylist } from '@/pages/detail/useQueryPlaylist'
import usePlayQueue from '@/hooks/usePlayQueue'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import { downloadMusic } from '@/hooks/useDownload'
import { usePlayer } from '@/hooks/usePlayer'
import { useTrackOperation } from '@/hooks/useTrackOperation'

// utils and types
import { formatDate, formatDuring, formatNumber } from '@/util/fn'
import type { Playlist } from '@/types'
import { Track as TrackType } from '@/types'
import { sub } from '@/api/music'
import { deletePlayList } from '@/api/playlist'


const PlayListHeader = memo(({ playlist, cover }: { playlist: Playlist | undefined; cover?: string }) => {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const tracksDt = playlist?.tracks?.reduce((p, c: any) => p + c.dt, 0)

  const { openContextMenu } = useContextMenu()
  const { isCreatedPlaylist } = useMyPlaylist()
  const { addToQueueAndPlay } = usePlayQueue()

  const [subscribed, setSubscribed] = useState(false)
  const [copied, copyToClipboard] = useCopyToClipboard()

  useEffect(() => {
    setSubscribed(playlist.subscribed)
  }, [playlist])

  const handlePlay = useCallback(() => {
    addToQueueAndPlay(playlist.tracks, playlist.id, 'playlist', playlist.name)
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
          copyToClipboard(`https://music.163.com/#/playlist?id=${playlist.id}`)
          enqueueSnackbar('已复制分享链接到粘贴板', { variant: 'success' })
        },
      },
    ]
    openContextMenu(e,  items)
  }
  return (
    <div className="flex flex-col">
        <div className="flex justify-between -ml-2 -mr-4 relative" style={{ height: '317px' }}>
          <Box
            className='absolute w-full h-full'
            sx={{
              backgroundImage: `linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`,
            }}
          >
            <img
              alt={playlist?.name}
              className='absolute h-full w-full -z-10 object-cover'
              src={ cover ?? playlist?.coverImgUrl}
              loading="lazy"
            />
          </Box>

          {/*<Image*/}
          {/*  className="absolute"*/}
          {/*  src={playlist?.coverImgUrl}*/}
          {/*  fit="cover"*/}
          {/*  gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}*/}
          {/*/>*/}
          {
            playlist?.coverImgUrl &&
              <ImageViewer open={showImageView} src={playlist?.coverImgUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1"></div>
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
                <Typography variant='caption'>{playlist['description']}</Typography>
              </DialogContent>
            </Md3Dialog>
          </>
        }
      </div>
  )
})
export default function PlaylistPage() {

  const params = useParams()
  const { isCreatedPlaylist, isMyPlaylist, isMyFavList } = useMyPlaylist()
  const isMyList = useMemo(() => {
    if (params.id)
      return isMyPlaylist(+params.id)

  }, [params])
  const { data, isLoading } = useQueryPlaylist(params.id, isMyList)
  const { data: relatedPlaylist } = useQueryRelatedPlaylist(params.id)
  const { height: windowHeight } = useWindowSize()
  const { player } = usePlayer()
  const navigate = useNavigate()
  const { openContextMenu } = useContextMenu()
  const { getToPlaylistMenuItem, removeFromPlaylist } = useTrackOperation()
  const cover = useMemo(() => {
    return isMyFavList(+params.id) ? data?.playlist?.tracks[0]?.al.picUrl : data?.playlist.coverImgUrl
  }, [data, params])


  const handleTrackPlay = useCallback((trackId: number) => {
    player.updatePlayerTrack(trackId, true, true, false, { type: 'playlist', id: data.playlist.id })
  }, [data])

  const handleContextMenu = useCallback((e:  React.MouseEvent<HTMLElement, MouseEvent>, track: TrackType) => {
    openContextMenu(e, [
      {
        type: 'item',
        label: '下一首播放',
        onClick: () => {

        },
      },
      {
        type: 'divider',
      },
      // {
      //   type: 'item',
      //   label: '查看评论',
      //   onClick: () => {},
      // },
      {
        label: '转至艺人',
        ...(track.ar && track.ar.length > 1
          ? {
              type: 'submenu',
              items: track.ar?.map((artist) => {
                return {
                  type: 'item',
                  label: artist.name,
                  onClick: () => {
                    toArtist(artist.id)
                  },
                }
              }),
            }
          : {
              type: 'item',
              onClick: (i) => {
                toArtist(track.ar![0].id)
              },
            }),
      },

      {
        type: 'item',
        label: '转至专辑',
        onClick: () => {
          toAlbum(track.al!.id)
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'submenu',
        label: '添加到歌单',
        items: getToPlaylistMenuItem(track),
      },
      ...(isCreatedPlaylist(data.playlist) ? [{
        type: 'item' as any,
        label: '从本歌单移除',
        onClick: () => {
          removeFromPlaylist(track.id, data.playlist)
          // todo remove from playlist
        },
      }] : []),
      {
        type: 'item',
        label: '下载到本地',
        onClick: async (i) => {
          await downloadMusic(track)
        },
      },
    ], {
      useCursorPosition: true,
    })
  }, [data])
  function toArtist(id: number) {
    navigate(`/artist/${id}`)
  }
  function toAlbum(id: number) {
    navigate(`/album/${id}`)
  }
  return (
    <PageTransition>
      {
        isLoading ? <PlayListSkeleton/> :  <Virtuoso
          className='hide-scrollbar'
          style={
            {
              height: `${windowHeight - 80}px`,
            }
          }
          itemContent={(_, track) => {
            return <Track
              key={track.id}
              track={track}
              onPlay={handleTrackPlay}
              onContextMenu={handleContextMenu}
            />
          }}
          data={data?.playlist.tracks}
          totalCount={data?.playlist.trackCount}
          fixedItemHeight={64}
          overscan={16}
          components={{
            Header: () => <PlayListHeader playlist={data?.playlist} cover={cover} />,
            Footer: () =>
              <Col variant='h6' title='相似歌单'>
                <GridRow singleLine>
                  {
                    relatedPlaylist?.relatedPlaylists?.map((i) => {
                      return <Cover data={i} key={i.id} type='playlist' />
                    })
                  }
                </GridRow>
              </Col>,
          }}
        >
        </Virtuoso>
      }

    </PageTransition>
  )
}
