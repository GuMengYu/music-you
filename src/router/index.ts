// types
import type { App } from 'vue'
import type { RouteLocation, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

import Album from '@/pages/Album.vue'
import Artist from '@/pages/Artist.vue'
import Daily from '@/pages/Daily.vue'
import Discover from '@/pages/discover/Discover.vue'
import FourOhFour from '@/pages/errors/FourOhFour.vue'
import Explore from '@/pages/explore/Explore.vue'
import Leaderboard from '@/pages/explore/Leaderboard.vue'
import Home from '@/pages/Home.vue'
import Library from '@/pages/Library.vue'
import List from '@/pages/List.vue'
import Minimal from '@/pages/minimal/Minimal.vue'
import MoodsGenresDetail from '@/pages/moods-genres/detail.vue'
import MoodsGenres from '@/pages/moods-genres/MoodsGenres.vue'
import MV from '@/pages/MV.vue'
import NewAlbum from '@/pages/new-releases/albums.vue'
import NewVideo from '@/pages/new-releases/videos.vue'
import Playground from '@/pages/Playground.vue'
import PodcastCenter from '@/pages/podcast/center.vue'
import PodcastGenreDetail from '@/pages/podcast/genres/detail.vue'
import Podcast from '@/pages/podcast/podcast.vue'
import Queue from '@/pages/Queue.vue'
import Recent from '@/pages/Recent.vue'
import Search from '@/pages/search/index.vue'
import Setting from '@/pages/setting/Setting.vue'
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
  {
    path: 'podcast-center/',
    name: 'podcast-center',
    component: PodcastCenter,
    meta: { keepAlive: true },
  },
  {
    path: 'podcast/:id',
    name: 'podcast',
    component: Podcast,
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/podcast-genre/:categoryName/:categoryId',
    name: 'podcast-genre',
    component: PodcastGenreDetail,
    props: true,
    meta: { keepAlive: true },
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
        path: '/minimal',
        name: 'Minimal',
        component: Minimal,
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
