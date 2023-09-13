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

const lazyLoad = (component: ReactNode) => {
  return <Suspense>{component}</Suspense>;
};

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/library",
          element: <Library />,
        },
        {
          path: "/search",
          element: <Search />,
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
