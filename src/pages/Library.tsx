import { Box, Typography, useTheme } from '@mui/material'
import { useMemo, useState } from 'react'

import { groupBy } from 'lodash-es'
import MYTabs from '@/components/Tabs'
import PageTransition from '@/components/PageTransition'
import { useUserStore } from '@/store/user'
import GridRow from '@/components/GridRow'
import { Cover } from '@/components/cover/Cover'
import { useUserAlbums, useUserArtists } from '@/hooks/query/user'
import ArtistCover from '@/components/cover/ArtistCover'


function ArtistPanel() {
  const { data } = useUserArtists()
  return <GridRow>
    {
      data?.artists.map(art => <ArtistCover compact data={art} key={art.id} />)
    }
  </GridRow>
}
function PlaylistPanel() {
  const { playlists, account } = useUserStore()
  const filteredPlaylist = useMemo(() => {
    const uid = account?.profile.userId
    return groupBy(playlists, (i) => {
      return i.userId === uid ? 'create' : 'sub'
    })
  }, [playlists, account])
  return <div className='flex flex-col gap-4'>
    <div>
      <Typography variant='body1'>创建的歌单</Typography>
      <GridRow>
        {
          filteredPlaylist['create']?.map(playlist => (<Cover key={playlist.id} inset type='playlist' data={playlist} />))
        }
      </GridRow>
    </div>
    <div>
      <Typography variant='body1'>收藏的歌单</Typography>

      <GridRow>
        {
          filteredPlaylist['sub']?.map(playlist => (<Cover key={playlist.id} inset type='playlist' data={playlist} />))
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
function Library() {
  const [currentTab, setCurrentTab] = useState('playlist')
  const theme = useTheme()
  return <PageTransition>
    <Box sx={{ color: theme.palette.onSurface.main }} className='h-full'>
      <MYTabs value={currentTab} onChange={tabVal => setCurrentTab(tabVal)}
        tabs={[{
          value: 'playlist',
          label: 'Playlist',
        }, { value: 'album', label: 'Alum' }, { value: 'artist', label: 'Artist' }]}/>
      <Box className='overflow-y-auto px-2 my-4 h-full'>
        {
          {
            artist: <ArtistPanel />,
            playlist: <PlaylistPanel />,
            album: <AlbumPanel />,
          }[currentTab]
        }
      </Box>
    </Box>
  </PageTransition>
}

export default Library
