import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import { ReactNode, Suspense, lazy } from 'react'


const App = lazy(() => import('./App'))
const Home = lazy(() => import('./pages/Home'))
const Library = lazy(() => import('./pages/Library'))

const NotFound = lazy(() => import('./pages/NotFound'))
const Search = lazy(() => import('./pages/Search'))

const lazyLoad = (component: ReactNode) => {
  return <Suspense>{component}</Suspense>
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={lazyLoad(<App />)}>
      <Route path='/home' element={lazyLoad(<Home />)} />
      <Route path='/library' element={lazyLoad(<Library />)} />

      {/* <Route
        path='/flow/:id'
        element={lazyLoad(<FlowDetail />)}
        loader={async ({ params }) => {
          if (params.id) {
            const { data } = await fetchFlow(params.id)
            return data
          }
        }}
      /> */}
      {/* <Route path='/settings' element={lazyLoad(<Setting />)} /> */}
      <Route path='/search' element={lazyLoad(<Search />)} />
      <Route path='*' element={lazyLoad(<NotFound/>)} />
    </Route>
  )
)
export default router
