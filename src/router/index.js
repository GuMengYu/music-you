import Vue from 'vue'
import VueRouter from 'vue-router'

const lazyLoad = name => () => import(/* webpackChunkName: "page" */ `../views/${name}`)

Vue.use(VueRouter)
const musicRoutes = [{
  path: 'discover/',
  name: 'discover',
  component: lazyLoad('Discover'),
  meta: {keepAlive: true},
}, {
  path: 'explore/',
  name: 'explore',
  component: lazyLoad('Explore/'),
  meta: {keepAlive: true},
}, {
  path: 'library/',
  name: 'library',
  component: lazyLoad('Library'),
  meta: {keepAlive: true},
}, {
  path: 'singer/',
  name: 'singer',
  component: lazyLoad('Explore/Singer'),
}, {
  path: 'leaderboard/',
  name: 'leaderboard',
  component: lazyLoad('Explore/Leaderboard'),
}, {
  path: 'playlistcenter/',
  name: 'playlistcenter',
  component: lazyLoad('Explore/PlaylistCenter'),
}, {
  path: 'fm',
  name: 'fm',
  component: lazyLoad('Fm'),
  meta: {keepAlive: true},
}, {
  path: 'daily',
  name: 'daily',
  component: lazyLoad('Daily'),
  meta: {keepAlive: true},
}, {
  path: 'album/:id',
  name: 'album',
  component: lazyLoad('List'),
  props: route => ({id: route.params.id, type: route.matched[1]?.name}),
  meta: {keepAlive: true},
}, {
  path: 'playlist/:id',
  name: 'playlist',
  component: lazyLoad('List'),
  props: route => ({id: route.params.id, type: route.matched[1]?.name}),
  meta: {keepAlive: true},
}, {
  path: 'video/:id',
  name: 'video',
  component: lazyLoad('MV'),
  props: true,
  meta: {keepAlive: true},
}, {
  path: 'artist/:id/',
  name: 'artist',
  component: lazyLoad('Artist'),
  props: true,
  meta: {keepAlive: true},
}, {
  path: 'moods_and_genres',
  name: 'moods_and_genres',
  component: lazyLoad('MoodsGenres/'),
  meta: {keepAlive: true},
}, {
  path: 'moods_and_genres/:type',
  name: 'moods_and_genres_detail',
  component: lazyLoad('MoodsGenres/detail'),
  props: true,
  meta: {keepAlive: true},
}]

export function createRouter() {
  return new VueRouter({
    mode: 'history',
    routes: [{
      path: '/',
      component: lazyLoad('index'),
      children: musicRoutes,
      redirect: {name: 'discover'},
    }, {
      path: '*',
      name: 'FourOhFour',
      component: () => import(/* webpackChunkName: "FourOhFour" */ '../views/errors/FourOhFour.vue'),
    }],
  })
}
