import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { memo, useEffect, useState } from 'react'
import { Button, Card, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AlbumIcon from '@mui/icons-material/Album'
import { useNavigate } from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings'
import { sampleSize } from 'lodash'
import { ipcRenderer } from 'electron'
import { useTranslation } from 'react-i18next'
import Cover from './components/Cover'
import PageTransition from '@/components/PageTransition'
import MYTabs from '@/components/Tabs'
import { bytesToSize, formatDuring, sizeOfImage } from '@/util/fn'
import GridRow from '@/components/GridRow'
import { useReplacePlayQueue } from '@/hooks/usePlayQueue'
import SwitchCard from '@/components/SwitchCard'
import useQueryTrack from '@/pages/local/hooks/useQueryTrack'
import { useQueryAlbums } from '@/pages/local/hooks/useQueryAlbum'
import Image from '@/components/Image'
import Migration from '@/components/migration'
import LocalTrackList from '@/pages/local/LocalTrackList'

const AlbumCovers = memo(({ albums }: { albums: any[] }) => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-shrink-0 gap-2'>
      {albums?.map((album: any) => (
        <div className='h-24 w-24 cursor-pointer' key={album.id}>
          <Image
            src={sizeOfImage(album.picUrl)}
            className='aspect-square rounded-2xl'
            onClick={() => navigate(`/local/album/${album.id}`, {
              state: album,
            })}
          />
        </div>

      ))}
    </div>
  )
})

function LocalTracksPanel() {
  const { data, isLoading } = useQueryTrack()
  return <Box>
    <LocalTrackList tracks={data?.tracks}></LocalTrackList>
  </Box>
}

function LocalAlbumPanel() {
  const { data, isLoading } = useQueryAlbums()
  return <GridRow>
    {
      data?.albums.map(((al: any) => (<Cover type='album' key={al.id} data={al} />)))
    }
  </GridRow>
}
function LocalArtistPanel() {
  return <Box>
    <Migration />
  </Box>
}
function LocalPlaylistPanel() {
  return <Box>
    <Migration />
  </Box>
}

function FavCard() {
  const theme = useTheme()
  const { t } = useTranslation()

  const { replaceQueueAndPlay } = useReplacePlayQueue()
  const [randomAlbums, setRandomAlbums] = useState<any[]>([])
  const { data } = useQueryTrack()
  const { data: albumData } = useQueryAlbums()

  useEffect(() => {
    if (albumData?.albums) {
      const albums = sampleSize(albumData.albums, 3)
      if (albums?.length)
        setRandomAlbums(albums)
    }
  }, [albumData])

  function handlePlay() {
    replaceQueueAndPlay(data.tracks, 0, 'local', '本地歌曲')
  }

  return <Card className='flex flex-col col-span-3' variant='outlined' sx={{
    flex: 1,
    bgcolor: theme.palette.secondaryContainer.main,
    color: theme.palette.onSecondaryContainer.main,
    borderRadius: 4,
    p: 2,
  }}>
    <div className='flex items-center'>
      <div>
        <Typography variant='h5'>{t`main.local.local_music`}</Typography>
        <Typography variant='caption'>{t('main.local.track_count', {
          track_count: data?.tracks.length,
          track_duration: formatDuring(data?.totalDt),
          track_size: bytesToSize(data?.totalSize),
        })}</Typography>
      </div>
    </div>

    <div className='flex justify-between items-end mt-auto'>
      <Button
        disableElevation
        color={'errorContainer' as 'primary'}
        className='no-drag-area'
        variant="contained"
        sx={{
          height: 56,
          width: 56,
          borderRadius: 4,
          minWidth: 50,
        }}
        onClick={handlePlay}
      ><PlayArrowIcon color={'onErrorContainer' as 'primary'}/> </Button>
      <AlbumCovers albums={randomAlbums} />
    </div>
  </Card>
}
export default function LocalLibrary() {
  const theme = useTheme()
  const { t } = useTranslation()
  const [currentTab, setCurrentTab] = useState('tracks')
  const navigate = useNavigate()
  return <PageTransition className='pr-2'>
    <div
      className='grid grid-cols-4 gap-4 mb-2'
    >

      <FavCard />
      <div className='grid grid-cols-1 grid-rows-4 gap-2 col-span-1'>
        <SwitchCard color={theme.palette.tertiaryContainer.main} title={t`main.local.manage`} icon={<SettingsIcon fontSize='small' />} onChange={() => {
          navigate('/setting')
        }} />
        <SwitchCard color={theme.palette.secondaryContainer.main} title={t`main.local.open_dir`} icon={<AlbumIcon fontSize='small' />} onClick={() => {
          ipcRenderer.invoke('base/open-path', '~/Downloads/')
        }} />
      </div>
    </div>
    <Box className='h-full flex flex-col pr-2' sx={{ color: theme.palette.onSurface.main }}>
      <MYTabs value={currentTab} onChange={tabVal => setCurrentTab(tabVal)}
              tabs={[
                { value: 'tracks', label: t`main.tracks` },
                { value: 'album', label: t`main.albums` },
                { value: 'artist', label: t`main.artists` },
                { value: 'playlist', label: t`main.local.playlist` },
              ]}/>
      <Box className='overflow-y-auto h-full mt-4 hide-scrollbar'>
        {
          {
            tracks: <LocalTracksPanel />,
            album: <LocalAlbumPanel />,
            artist: <LocalArtistPanel />,
            playlist: <LocalPlaylistPanel />,

          }[currentTab]
        }
      </Box>
    </Box>

  </PageTransition>
}
