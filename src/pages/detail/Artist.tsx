import { Box, Button, DialogContent, DialogTitle, Divider, IconButton, Typography, useTheme } from '@mui/material'
import { useParams } from 'react-router-dom'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { motion } from 'framer-motion'
import { useCallback, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import Md3Dialog from '@/pages/modal/Md3Dialog'
import TrackList from '@/components/TrackList'
import PageTransition from '@/components/PageTransition'
import PlayListSkeleton from '@/pages/detail/PlayListSkeleton'
import type { Artist } from '@/types'
import Image from '@/components/Image'
import ImageViewer from '@/components/ImageViewer'
import useQueryArtist from '@/pages/detail/useQueryArtist'
import Col from '@/components/Col'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import ArtistCover from '@/components/cover/ArtistCover'
import { usePlayerControl } from '@/hooks/usePlayer'

function Header({ artist, onPlay }: { artist: Artist | undefined; onPlay: () => void }) {
  const theme = useTheme()
  const [showDesc, setShowDesc] = useState(false)
  const [showImageView, setShowImageView] = useState(false)
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
            src={artist.picUrl}
            fit="cover"
            gradient={`linear-gradient(90deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 50%, ${theme.palette.surface.main}b3 100%), linear-gradient(360deg, ${theme.palette.surface.main} 0%, rgb(0 0 0 / 0%) 100%)`}
          />
          {
            artist?.picUrl &&
              <ImageViewer open={showImageView} src={artist?.picUrl} onClose={() => setShowImageView(false)}/>
          }

          <div className="absolute h-full w-full flex flex-col">
            <div className="flex-1" onClick={() => setShowImageView(true)}></div>
            <div className="flex flex-col mx-3 mb-4 gap-2">
              <Typography variant="h4">{artist?.name}</Typography>
              <div className="flex flex-col">
                <Typography variant='body1'>
                  {artist.transNames.join('·')}
                  {artist.alias?.length ? `(${artist.alias.join('/')})` : ''}
                </Typography>
                <Typography variant='caption'>
                  {[...(artist['identifyTag'] ?? []), ...(artist['identities'] ?? [])].join('·')}
                </Typography>
              </div>
              <div className="flex py-2">
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <QueueMusicIcon fontSize='small'/>
                  <Typography variant="caption">歌手</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>

                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">曲目</Typography>
                  <Typography variant="caption">{artist.musicSize}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">专辑</Typography>
                  <Typography variant="caption">{artist.albumSize}</Typography>
                </div>
                <Divider flexItem variant='middle' orientation="vertical"/>
                <div
                  className="flex flex-col items-center px-4"
                  style={{ minWidth: '96px' }}
                >
                  <Typography variant="body2">MV</Typography>
                  <Typography variant="caption">{artist.mvSize}</Typography>
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
                }}>
                  <MoreHorizIcon/>
                </IconButton>
              </div>
            </div>
          </div>
        </div>
        {
          artist?.briefDesc && <>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                        <Typography variant='body1'>歌手简介</Typography>
                        <IconButton onClick={() => setShowDesc(true)}>
                            <ArrowForwardIcon/>
                        </IconButton>
                    </div>
                </div>
                <Md3Dialog fullWidth maxWidth='xs' open={showDesc} onClose={() => setShowDesc(false)}>
                    <DialogTitle variant='body1'>歌手简介</DialogTitle>
                    <DialogContent>
                        <Typography className='line-clamp-3' variant='caption'>{artist.briefDesc}</Typography>
                    </DialogContent>
                </Md3Dialog>
            </>
        }
      </div>
    </motion.div>
  )
}

export default function ArtistPage() {
  const params = useParams()
  const theme = useTheme()
  const { data, isLoading } = useQueryArtist(params.id)
  const [more, setMore] = useImmer({
    showMoreSong: false,
    showMoreAlbum: false,
    showMoreEps: false,
    showMoreCollection: false,
    showMoreMVs: false,
    showMoreDesc: false,
  })
  const albums = useMemo(() => data?.hotAlbums.filter(a => a.type === '专辑'), [data])
  const epAndSingle = useMemo(() => data?.hotAlbums.filter(a => ['EP/Single', 'EP', 'Single'].includes(a.type)), [data])
  const collection = useMemo(() => data?.hotAlbums.filter(a => a.type === '合集'), [data])

  const { addToQueueAndPlay } = usePlayerControl()

  const handlePlay = useCallback(() =>  {
    if (data.artist)
      addToQueueAndPlay(data.hotSongs, data.artist.id, 'artist', data.artist.name)
  }, [data])
  return (
    <PageTransition>
      {isLoading}
      <Box sx={{ color: theme.palette.onSurface.main, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {
          isLoading ? <PlayListSkeleton/> : <Header artist={data.artist} onPlay={handlePlay}/>
        }
        {
          data?.hotSongs && <Col
                variant='body1'
                title="热门歌曲"
                more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreSong = !draft.showMoreSong
                })
              }}>
                  {
                    more.showMoreSong ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
                  }
                </IconButton>
          }
            >
                <TrackList tracks={more.showMoreSong ? data.hotSongs : data.hotSongs.slice(0, 5)}/>
            </Col>
        }

        {
          albums?.length && <Col title="专辑" variant='body1' more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreAlbum = !draft.showMoreAlbum
                })
              }}>
              {
                more.showMoreAlbum ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
              }
            </IconButton>
          }>
            <GridRow>
              {
                (more.showMoreAlbum ? albums : albums.slice(0, 4))?.map((album) => {
                  return <Cover data={album} type={'album'} key={album.id} />
                })
              }
            </GridRow>
          </Col>
        }


        {
          epAndSingle?.length && <Col title="单曲和EP" variant='body1' more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreEps = !draft.showMoreEps
                })
              }}>
              {
                more.showMoreEps ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
              }
            </IconButton>
          }>
            <GridRow>
              {
                (more.showMoreEps ? epAndSingle : epAndSingle.slice(0, 4))?.map((album) => {
                  return <Cover data={album} type={'album'} key={album.id} />
                })
              }
            </GridRow>
          </Col>
        }
        {
          collection?.length ? <Col title="合集" variant='body1' more={
            <IconButton
              color='primary'
              onClick={() => {
                setMore((draft) => {
                  draft.showMoreCollection = !draft.showMoreCollection
                })
              }}>
              {
                more.showMoreCollection ? <ArrowCircleUpIcon fontSize='small'/> : <ArrowCircleDownIcon fontSize='small'/>
              }
            </IconButton>
          }>
            <GridRow>
              {
                (more.showMoreCollection ? collection : collection.slice(0, 4))?.map((album) => {
                  return <Cover data={album} type={'album'} key={album.id} />
                })
              }
            </GridRow>
          </Col> : null
        }
        {
          <Col title="相似歌手">
            <GridRow>
              {
                data?.simiArtists && data.simiArtists.map((artist) => {
                  return <ArtistCover data={artist} key={artist.id} compact />
                })
              }
            </GridRow>
          </Col>
        }

      </Box>
    </PageTransition>

  )
}
