import {
  createBrowserRouter,
} from 'react-router-dom'

import type { ReactNode } from 'react'
import { Suspense } from 'react'
import App from './App'

import Home from './pages/Home'
import Library from './pages/Library'
import LocalLibrary from './pages/local/LocalLibrary'

import NotFound from './pages/NotFound'
import Search from './pages/Search'
import PlaylistPage from './pages/detail/Playlist'
import { getPlaylistDetail } from './api/playlist'
import Playground from '@/pages/Playground'
import Setting from '@/pages/setting/Setting'
import LocalAlbumPage from '@/pages/local/components/Album'
import AlbumPage from '@/pages/detail/Album'
import ArtistPage from '@/pages/detail/Artist'
import DailyPage from '@/pages/Daily'

function lazyLoad(component: ReactNode) {
  return <Suspense>{component}</Suspense>
}

function playlistDetailQuery(id: number) {
  return {
    queryKey: ['playlist', 'detail', id],
    queryFn: async () => getPlaylistDetail(id),
  }
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          id: 'redirect_home',
          path: '/',
          element: <Home />,
        },
        {
          id: 'home',
          path: '/home',
          element: <Home />,
        },
        {
          id: 'daily',
          path: '/daily',
          element: <DailyPage />,
        },
        {
          id: 'library',
          path: '/library',
          element: <Library />,
        },
        {
          id: 'playlist',
          path: '/playlist/:id',
          element: <PlaylistPage />,
        },
        {
          id: 'album',
          path: '/album/:id',
          element: <AlbumPage />,
        }, {
          id: 'artist',
          path: '/artist/:id',
          element: <ArtistPage />,
        },
        {
          id: 'setting',
          path: '/setting',
          element: <Setting />,
        },
        {
          id: 'search',
          path: '/search',
          element: <Search />,
        },
        {
          id: 'playground',
          path: '/playground',
          element: <Playground/>,
        },
        {
          id: 'local-library',
          path: '/local-library',
          element: <LocalLibrary />,
        },
        {
          id: 'local-album',
          path: '/local/album/:id?',
          element: <LocalAlbumPage />,
        },
        {
          path: '*',
          element: <NotFound />,
        },
      ],
    },
  ],
  // createRoutesFromElements(
  //   <Route path='/' element={lazyLoad(<App />)}>
  //     <Route path='/home' element={lazyLoad(<Home />)} />
  //     <Route path='/library' element={lazyLoad(<Library />)} />

  //     {/* <Route
  //       path='/flow/:id'
  //       element={lazyLoad(<FlowDetail />)}
  //       loader={async ({ params }) => {
  //         if (params.id) {
  //           const { data } = await fetchFlow(params.id)
  //           return data
  //         }
  //       }}
  //     /> */}
  //     {/* <Route path='/settings' element={lazyLoad(<Setting />)} /> */}
  //     <Route path='/search' element={lazyLoad(<Search />)} />
  //     <Route path='*' element={lazyLoad(<NotFound/>)} />
  //   </Route>
  // )
)
export default router
