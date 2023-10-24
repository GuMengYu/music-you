import { Box, Button, Card, Typography, useTheme } from '@mui/material'
import { memo, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { sampleSize } from 'lodash-es'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AlbumIcon from '@mui/icons-material/Album'
import HistoryIcon from '@mui/icons-material/History'
import PodcastsIcon from '@mui/icons-material/Podcasts'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import MYTabs from '@/components/Tabs'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import { useUserAlbums, useUserArtists, useUserMVs } from '@/hooks/query/user'
import ArtistCover from '@/components/cover/ArtistCover'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import VideoCover from '@/components/cover/VideoCover'
import { GridType } from '@/hooks/useResponsiveGrid'
import SwitchCard from '@/components/SwitchCard'
import { Track } from '@/types'
import { formatNumber, sizeOfImage } from '@/util/fn'
import Image from '@/components/Image'
import { useUserStore } from '@/store/user'
import { getSongData } from '@/api/song'
import usePlayQueue from '@/hooks/usePlayQueue'
import { getTrackList } from '@/api/music'
import Col from '@/components/Col'

const AlbumCovers = memo(({ tracks }: { tracks: Track[] }) => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-shrink-0 gap-2'>
      {tracks?.map(track => (
        <div className='h-24 w-24 cursor-pointer' key={track.id}>
          <Image
            src={sizeOfImage(track.al.picUrl)}
            className='aspect-square rounded-2xl'
            onClick={() => navigate(`/album/${track.al.id}`)}
          />
        </div>

      ))}
    </div>
  )
})

function ArtistPanel() {
  const { data } = useUserArtists()
  return <GridRow>
    {
      data?.artists.map(art => <ArtistCover compact data={art} key={art.id} />)
    }
  </GridRow>
}
function PlaylistPanel() {
  const { createdPlaylist, subscribePlaylist } = useMyPlaylist()
  return <div className='flex flex-col gap-4'>
    <Col title='创建的歌单' variant='body1'>
      <GridRow>
        {
          createdPlaylist?.map(playlist => (<Cover key={playlist.id} type='playlist' data={playlist} />))
        }
      </GridRow>
    </Col>
    <Col title='收藏的歌单' variant='body1'>
      <GridRow>
        {
          subscribePlaylist?.map(playlist => (<Cover key={playlist.id} type='playlist' data={playlist} />))
        }
      </GridRow>
    </Col>
  </div>
}
function AlbumPanel() {
  const { data } = useUserAlbums()
  return <GridRow>
    {
      data?.albums.map((al => (<Cover type='album' inset key={al.id} data={al} />)))
    }
  </GridRow>
}
function MVPanel() {
  const { data } = useUserMVs()
  return <GridRow rowType={GridType.B}>
    {
      data?.mvs.map((mv => (<VideoCover key={mv.vid} data={mv} />)))
    }
  </GridRow>
}

function FavCard() {
  const theme = useTheme()
  const { likes } = useUserStore()
  const { favList } = useMyPlaylist()
  const { addToQueueAndPlay } = usePlayQueue()

  const [randomTracks, setRandomTracks] = useState<Track[]>()

  useEffect(() => {
    const tracks = sampleSize(likes, 3)
    if (tracks && tracks.length) {
      getSongData(tracks).then((res) => {
        setRandomTracks(res.songs)
      })
    }

    setRandomTracks([])

  }, [likes])
  async function handlePlayMyFav() {
    const _data = await getTrackList('playlist', favList.id)

    addToQueueAndPlay(_data.tracks, favList.id, 'playlist', favList.name)
  }


  return  <Card className='flex flex-col col-span-3' variant='outlined' sx={{
    flex: 1,
    bgcolor: theme.palette.surfaceVariant.main,
    color: theme.palette.onSurfaceVariant.main,
    borderRadius: 4,
    // border: 'none',
    p: 2,
  }}>
    <div className='flex items-center'>
      <div>
        <Typography variant='h5'>{favList.name}</Typography>
        <Typography variant='caption'>共 {favList.trackCount} 首, 播放了 {formatNumber(favList.playCount) } 次</Typography>
      </div>
      <div>

      </div>
    </div>


    <div className='flex justify-between items-end mt-auto'>
      <Button
        disableElevation
        color={'tertiaryContainer' as 'primary'}
        className='no-drag-area'
        variant="contained"
        sx={{
          height: 56,
          width: 56,
          borderRadius: 4,
          minWidth: 50,
        }}
        onClick={handlePlayMyFav}
      ><PlayArrowIcon color={'onTertiaryContainer' as 'primary'}/> </Button>
      <AlbumCovers tracks={randomTracks} />
    </div>
  </Card>
}

function Library() {
  const [currentTab, setCurrentTab] = useState('playlist')
  const theme = useTheme()
  const navigate = useNavigate()
  return <PageTransition className='pr-2'>
    <div
      className='grid grid-cols-4 gap-4 mb-2'
    >

      <FavCard />
      <div className='grid grid-cols-1 grid-rows-4 gap-2 col-span-1'>
        <SwitchCard color={theme.palette.tertiaryContainer.main} title='听歌排行' icon={<ThumbUpAltIcon fontSize='small'  />} onChange={() => {
          navigate('/rank')
        }} />
        <SwitchCard color={theme.palette.secondaryContainer.main} title='音乐云盘' icon={<AlbumIcon fontSize='small' />} onClick={() => {
          navigate('/cloud')
        }} />
        <SwitchCard color={theme.palette.errorContainer.main} title='最近播放' icon={<HistoryIcon fontSize='small' />} onClick={() => {
          navigate('/recent')
        }} />
        <SwitchCard color={theme.palette.primaryContainer.main} title='我的播客' icon={<PodcastsIcon fontSize='small' />} onClick={() => {
          navigate('/my_podcast')
        }} />
      </div>
    </div>
    <Box sx={{ color: theme.palette.onSurface.main }} className='h-full'>
      <MYTabs value={currentTab} onChange={tabVal => setCurrentTab(tabVal)}
        tabs={[{
          value: 'playlist',
          label: '歌单',
        },
        { value: 'album', label: '专辑' },
        { value: 'artist', label: '艺术家' },
        { value: 'mv', label: '音乐视频' }]}/>
      <Box className='overflow-y-auto my-2 h-full hide-scrollbar'>
        {
          {
            artist: <ArtistPanel />,
            playlist: <PlaylistPanel />,
            album: <AlbumPanel />,
            mv: <MVPanel />,
          }[currentTab]
        }
      </Box>
    </Box>
  </PageTransition>
}

export default Library
