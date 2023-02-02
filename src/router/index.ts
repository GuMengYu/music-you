// types
import type { App } from 'vue'
import type { RouteLocation, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

const Album = () => import('@/pages/Album.vue')
const Artist = () => import('@/pages/Artist.vue')
const Daily = () => import('@/pages/Daily.vue')
const Recent = () => import('@/pages/Recent.vue')
const Discover = () => import('@/pages/discover/Discover.vue')
const FourOhFour = () => import('@/pages/errors/FourOhFour.vue')
const Explore = () => import('@/pages/explore/Explore.vue')
const Leaderboard = () => import('@/pages/explore/Leaderboard.vue')
const Home = () => import('@/pages/Home.vue')
const Library = () => import('@/pages/Library.vue')
const List = () => import('@/pages/List.vue')
const MoodsGenresDetail = () => import('@/pages/moods-genres/detail.vue')
const MoodsGenres = () => import('@/pages/moods-genres/MoodsGenres.vue')
const MV = () => import('@/pages/MV.vue')
const NewAlbum = () => import('@/pages/new-releases/albums.vue')
const NewVideo = () => import('@/pages/new-releases/videos.vue')
const Playground = () => import('@/pages/Playground.vue')
const Queue = () => import('@/pages/Queue.vue')
const Search = () => import('@/pages/search/index.vue')
const Setting = () => import('@/pages/setting/Setting.vue')

const musicRoutes: RouteRecordRaw[] = [
  {
    path: 'discover/',
    name: 'discover',
    component: Discover,
    meta: { keepAlive: true },
  },
  {
    path: '/explore',
    name: 'explore',
    component: Explore,
    meta: { keepAlive: true },
  },
  {
    path: '/library/:tab?',
    name: 'library',
    component: Library,
    props: true,
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/leader_board',
    name: 'leader_board',
    component: Leaderboard,
  },
  {
    path: '/daily',
    name: 'daily',
    component: Daily,
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/album/:id',
    name: 'album',
    component: Album,
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: List,
    props: (route: RouteLocation) => ({
      id: route.params.id,
      type: route.matched[1]?.name,
    }),
    meta: { keepAlive: true },
  },
  {
    path: '/video/:id',
    name: 'video',
    component: MV,
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/artist/:id/',
    name: 'artist',
    component: Artist,
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/moods_and_genres',
    name: 'moods_and_genres',
    component: MoodsGenres,
    meta: { keepAlive: true },
  },
  {
    path: '/moods_and_genres/:type',
    name: 'moods_and_genres_detail',
    component: MoodsGenresDetail,
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/new_releases/albums',
    name: 'new_releases_albums',
    component: NewAlbum,
    meta: { keepAlive: true },
  },
  {
    path: '/new_releases/videos',
    name: 'new_releases_videos',
    component: NewVideo,
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/queue',
    name: 'queue',
    component: Queue,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/setting',
    name: 'setting',
    component: Setting,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search/:keywords?',
    name: 'search',
    component: Search,
    props: true,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/playground',
    name: 'playground',
    component: Playground,
  },
  {
    path: 'recent/:tab?',
    name: 'recent',
    component: Recent,
    props: true,
    meta: { keepAlive: true, needLogin: true },
  },
]

export function useRouter(app: App) {
  const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior: (to, from, savedPosition) => savedPosition || ({ x: 0, y: 0 } as any),
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        children: musicRoutes,
        redirect: { path: '/discover' },
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'FourOhFour',
        component: FourOhFour,
      },
    ],
  })
  // router.beforeEach(({ meta }, from, next) => {
  //   next()
  //   // const logged = store.getters['settings/logged'];
  //   // if (meta.needLogin && !logged) {
  //   //   store.commit('app/showLogin', true);
  //   // } else {

  //   // }
  // })
  // router.afterEach((to, from, failed) => {
  //   console.log(failed)
  // })
  app.use(router)
  return router
}
