// types
import type { App } from 'vue'
import type { RouteLocation, RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'

const modules = import.meta.glob('../pages/**/*.vue')

const musicRoutes: RouteRecordRaw[] = [
  {
    path: 'discover/',
    name: 'discover',
    component: modules['../pages/discover/Discover.vue'],
    meta: { keepAlive: true },
  },
  {
    path: '/explore',
    name: 'explore',
    component: modules['../pages/discover/explore/Explore.vue'],
    meta: { keepAlive: true },
  },
  {
    path: '/library',
    name: 'library',
    component: modules['../pages/discover/Library.vue'],
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/leader_board',
    name: 'leader_board',
    component: modules['../pages/explore/Leaderboard.vue'],
  },
  {
    path: '/daily',
    name: 'daily',
    component: modules['../pages/Daily.vue'],
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/album/:id',
    name: 'album',
    component: modules['../pages/Album.vue'],
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: modules['../pages/List.vue'],
    props: (route: RouteLocation) => ({
      id: route.params.id,
      type: route.matched[1]?.name,
    }),
    meta: { keepAlive: true },
  },
  {
    path: '/video/:id',
    name: 'video',
    component: modules['../pages/MV.vue'],
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/artist/:id/',
    name: 'artist',
    component: modules['../pages/Artist.vue'],
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/moods_and_genres',
    name: 'moods_and_genres',
    component: modules['../pages/MoodsGenres.vue'],
    meta: { keepAlive: true },
  },
  {
    path: '/moods_and_genres/:type',
    name: 'moods_and_genres_detail',
    component: modules['../pages/moods-genres/detail.vue'],
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/new_releases/albums',
    name: 'new_releases_albums',
    component: modules['../pages/new-releases/album.vue'],
    meta: { keepAlive: true },
  },
  {
    path: '/new_releases/videos',
    name: 'new_releases_videos',
    component: modules['../pages/new-releases/video.vue'],
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/queue',
    name: 'queue',
    component: modules['../pages/Queue.vue'],
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/setting',
    name: 'setting',
    component: modules['../pages/setting/Setting.vue'],
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search/:keywords?',
    name: 'search',
    component: modules['../pages/search/index.vue'],
    props: true,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search/:keywords/:type',
    name: 'searchMore',
    component: modules['../pages/search/more.vue'],
    props: true,
  },
  {
    path: '/playground',
    name: 'playground',
    component: modules['../pages/Playground.vue'],
  },
]

export function useRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
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
        component: () => import('../pages/errors/FourOhFour.vue'),
      },
    ],
  })
  router.beforeEach(({ meta }, from, next) => {
    next()
    // const logged = store.getters['settings/logged'];
    // if (meta.needLogin && !logged) {
    //   store.commit('app/showLogin', true);
    // } else {

    // }
  })
  app.use(router)
}
