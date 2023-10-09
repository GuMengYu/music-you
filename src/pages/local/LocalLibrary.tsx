import Box from '@mui/material/Box'
import { useQuery } from '@tanstack/react-query'
import { ipcRenderer } from 'electron'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Button, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Cover } from './components/Cover'
import PageTransition from '@/components/PageTransition'
import MYTabs from '@/components/Tabs'
import TrackList from '@/pages/local/TrackList'
import { bytesToSize, formatDuring } from '@/util/fn'
import { usePlayerControl } from '@/hooks/usePlayer'
import GridRow from '@/components/GridRow'


function LocalTracksPanel() {
  const theme = useTheme()
  const { addToQueueAndPlay }  = usePlayerControl()
  const { data } = useQuery(['local', 'tracks'], async () => {
    const { data, totalDt, totalSize } = await ipcRenderer.invoke('track/all-tracks')
    return {
      tracks: data,
      totalDt,
      totalSize,
    }
  })
  function handlePlay() {
    addToQueueAndPlay(data.tracks, 0, 'local', '本地歌曲' )
  }
  return <Box>
    <div className='flex justify-between items-center px-4'>
      <div className='flex gap-4'>
        <Typography variant='caption'>总大小：{bytesToSize(data?.totalSize)}</Typography>
        <Typography variant='caption'>总时长：{formatDuring(data?.totalDt)}</Typography>
      </div>
      <Button disableElevation variant='contained' sx={{
        'bgcolor': `${theme.palette.secondaryContainer.main}`,
        'color': theme.palette.primary.main,
        'borderRadius': 4,
        'px': 1.5,
        '&:hover': {
          bgcolor: `${theme.palette.primary.main}38`,
        },
      }} onClick={handlePlay}><PlayArrowIcon className='mr-1' color='primary'/>播放全部</Button>
    </div>
    <TrackList tracks={data?.tracks}></TrackList>
  </Box>
}

function LocalAlbumPanel() {
  const { data } = useQuery(['local', 'albums'], async () => {
    const albums = await ipcRenderer.invoke('album/all-albums')
    return {
      albums,
    }
  })
  return <GridRow>
    {
      data?.albums.map(((al: any) => (<Cover type='album' key={al.id} data={al} />)))
    }
  </GridRow>
}
function LocalArtistPanel() {
  return <Box></Box>
}
export default function LocalLibrary() {
  const theme = useTheme()
  const [currentTab, setCurrentTab] = useState('tracks')

  return <PageTransition>
    <Box className='h-full flex flex-col' sx={{ color: theme.palette.onSurface.main }}>
      <MYTabs value={currentTab} onChange={tabVal => setCurrentTab(tabVal)}
              tabs={[
                { value: 'tracks', label: '歌曲' },
                { value: 'album', label: '专辑' },
                { value: 'artist', label: '艺术家' },
                { value: 'playlist', label: '播放列表' },
              ]}/>
      <Box className='overflow-y-auto h-full mt-4 hide-scrollbar'>
        {
          {
            tracks: <LocalTracksPanel />,
            album: <LocalAlbumPanel />,
            artist: <LocalArtistPanel />,

          }[currentTab]
        }
      </Box>
    </Box>

  </PageTransition>
}
