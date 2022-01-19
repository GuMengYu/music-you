import Vue from 'vue';
import VueRouter from 'vue-router';

const lazyLoad = (name) => () =>
  import(/* webpackChunkName: "page" */ `@/views/${name}`);

Vue.use(VueRouter);
const musicRoutes = [
  {
    path: 'discover/',
    name: 'discover',
    component: lazyLoad('discover'),
    meta: { keepAlive: true },
  },
  {
    path: '/explore',
    name: 'explore',
    component: lazyLoad('explore/'),
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
    props: (route) => ({
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
    meta: { keepAlive: true },
  },
  {
    path: '/search/:keywords?',
    name: 'search',
    component: lazyLoad('search'),
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
    component: lazyLoad('playground'),
  },
];

export function createRouter(vuetify, store) {
  const router = new VueRouter({
    scrollBehavior: (to, from, savedPosition) =>
      savedPosition || { x: 0, y: 0 },
    routes: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/index'),
        children: musicRoutes,
        redirect: { path: '/discover' },
      },
      {
        path: '*',
        name: 'FourOhFour',
        component: () =>
          import(
            /* webpackChunkName: "FourOhFour" */ '@/views/errors/FourOhFour.vue'
          ),
      },
    ],
  });
  router.beforeEach(({ meta }, from, next) => {
    const logged = store.getters['settings/logged'];
    if (meta.needLogin && !logged) {
      store.commit('app/showLogin', true);
    } else {
      next();
    }
  });
  return router;
}
