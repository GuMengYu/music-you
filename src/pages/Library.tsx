import { Box, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

import MYTabs from '@/components/Tabs'
import PageTransition from '@/components/PageTransition'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import { useUserAlbums, useUserArtists, useUserMVs } from '@/hooks/query/user'
import ArtistCover from '@/components/cover/ArtistCover'
import { useMyPlaylist } from '@/hooks/usePlaylist'
import VideoCover from '@/components/cover/VideoCover'
import { GridType } from '@/hooks/useResponsiveGrid'


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
    <div>
      <Typography variant='body1'>创建的歌单</Typography>
      <GridRow>
        {
          createdPlaylist?.map(playlist => (<Cover key={playlist.id} type='playlist' data={playlist} />))
        }
      </GridRow>
    </div>
    <div>
      <Typography variant='body1'>收藏的歌单</Typography>

      <GridRow>
        {
          subscribePlaylist?.map(playlist => (<Cover key={playlist.id} type='playlist' data={playlist} />))
        }
      </GridRow>
    </div>

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

function Library() {
  const [currentTab, setCurrentTab] = useState('playlist')
  const theme = useTheme()
  return <PageTransition>
    <Box sx={{ color: theme.palette.onSurface.main }} className='h-full'>
      <MYTabs value={currentTab} onChange={tabVal => setCurrentTab(tabVal)}
        tabs={[{
          value: 'playlist',
          label: 'Playlist',
        },
        { value: 'album', label: 'Alum' },
        { value: 'artist', label: 'Artist' },
        { value: 'mv', label: 'MV' }]}/>
      <Box className='overflow-y-auto px-2 my-4 h-full hide-scrollbar'>
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
