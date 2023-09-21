import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

import { ReactNode, Suspense, lazy } from "react";
import App from "./App";

import Home from "./pages/Home";
import Library from "./pages/Library";

import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import PlaylistPage from "./pages/detail/Playlist";
import Playground from "@/pages/Playground";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistDetail } from "./api/playlist";
import { client as queryClient } from "./plugins/query";

const lazyLoad = (component: ReactNode) => {
  return <Suspense>{component}</Suspense>;
};

const playlistDetailQuery = (id: number) => ({
  queryKey: ["playlist", "detail", id],
  queryFn: async () => getPlaylistDetail(id),
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          id: 'redirect_home',
          path: "/",
          element: <Home />,
        },
        {
          id: 'home',
          path: "/home",
          element: <Home />,
        },
        {
          id: 'library',
          path: "/library",
          element: <Library />,
        },
        {
          id: 'playlist',
          path: "/playlist/:id",
          element: <PlaylistPage />,
        },
        {
          id: 'search',
          path: "/search",
          element: <Search />,
        },
        {
          id: 'playground',
          path: '/playground',
          element: <Playground/>
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]
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
);
export default router;
