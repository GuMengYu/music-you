import { createRouter, createWebHistory } from 'vue-router'

// types
import { App } from 'vue'
import { RouteLocation, RouterScrollBehavior } from 'vue-router'

const lazyLoad = (name: string) => () =>
  import(`../views/${name}.vue`);

const musicRoutes = [
  {
    path: 'discover/',
    name: 'discover',
    component: lazyLoad('Discover'),
    meta: { keepAlive: true },
  },
  {
    path: '/explore',
    name: 'explore',
    component: lazyLoad('Explore'),
    meta: { keepAlive: true },
  },
  {
    path: '/library',
    name: 'library',
    component: lazyLoad('Library'),
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/singer',
    name: 'singer',
    component: lazyLoad('explore/Singer'),
  },
  {
    path: '/leader_board',
    name: 'leader_board',
    component: lazyLoad('explore/Leaderboard'),
  },
  {
    path: '/playlistcenter',
    name: 'playlistcenter',
    component: lazyLoad('explore/PlaylistCenter'),
  },
  {
    path: '/fm',
    name: 'fm',
    component: lazyLoad('Fm'),
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/daily',
    name: 'daily',
    component: lazyLoad('Daily'),
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/album/:id',
    name: 'album',
    component: lazyLoad('Album'),
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/playlist/:id',
    name: 'playlist',
    component: lazyLoad('List'),
    props: (route: RouteLocation) => ({
      id: route.params.id,
      type: route.matched[1]?.name,
    }),
    meta: { keepAlive: true },
  },
  {
    path: '/video/:id',
    name: 'video',
    component: lazyLoad('MV'),
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/artist/:id/',
    name: 'artist',
    component: lazyLoad('Artist'),
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/moods_and_genres',
    name: 'moods_and_genres',
    component: lazyLoad('moods-genres/'),
    meta: { keepAlive: true },
  },
  {
    path: '/moods_and_genres/:type',
    name: 'moods_and_genres_detail',
    component: lazyLoad('moods-genres/detail'),
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/new_releases/albums',
    name: 'new_releases_albums',
    component: lazyLoad('new-releases/albums'),
    meta: { keepAlive: true },
  },
  {
    path: '/new_releases/videos',
    name: 'new_releases_videos',
    component: lazyLoad('new-releases/videos'),
    props: true,
    meta: { keepAlive: true },
  },
  {
    path: '/radio',
    name: 'radio',
    component: lazyLoad('Radio'),
    meta: { keepAlive: true },
  },
  {
    path: '/cloud_disk',
    name: 'cloud_disk',
    component: lazyLoad('CloudDisk'),
    meta: { keepAlive: true, needLogin: true },
  },
  {
    path: '/search/:keywords?',
    name: 'search',
    component: lazyLoad('Search'),
    props: true,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/search/:keywords/:type',
    name: 'searchMore',
    component: lazyLoad('search/more'),
  },
  {
    path: '/playground',
    name: 'playground',
    component: lazyLoad('example/playground'),
  },
];

export function useRouter(app: App) {
  const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: (to, from, savedPosition) =>
      savedPosition || { x: 0, y: 0 } as any,
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/index.vue'),
        children: musicRoutes,
        redirect: { path: '/discover' },
      },
      { path: '/:pathMatch(.*)*', name: 'FourOhFour', component: () =>
      import('@/views/errors/FourOhFour.vue') },
    ],
  });
  router.beforeEach(({ meta }, from, next) => {
    next();
    // const logged = store.getters['settings/logged'];
    // if (meta.needLogin && !logged) {
    //   store.commit('app/showLogin', true);
    // } else {
      
    // }
  });
  app.use(router)
}
