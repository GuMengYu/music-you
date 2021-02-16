import Vue from 'vue'
import VueRouter from 'vue-router'

const lazyLoad = name => () => import(/* webpackChunkName: "page" */ `../views/${name}`)

Vue.use(VueRouter)
const musicRoutes = [{
  path: 'now/',
  name: 'now',
  component: lazyLoad('Now'),
  meta: { keepAlive: true },
},{
  path: 'explore/',
  name: 'explore',
  component: lazyLoad('explore'),
  meta: { keepAlive: true },
  redirect: { name: 'songlist' },
  children: [
    {
      path: 'singer/',
      name: 'singer',
      component: lazyLoad('singer'),
    },
    {
      path: 'leaderboard/',
      name: 'leaderboard',
      component: lazyLoad('leaderboard'),
    },
    {
      path: 'songlist/',
      name: 'songlist',
      component: lazyLoad('songlist'),
    },
  ],
}, {
  path: 'playlist/:id/',
  name: 'playlist',
  component: lazyLoad('Playlist'),
  props: true,
  meta: { keepAlive: true },
}, {
  path: 'artist/:id/',
  name: 'artist',
  component: lazyLoad('Artist'),
  props: true,
  meta: { keepAlive: true },
}, {
  path: '*',
  name: 'FourOhFour',
  component: () => import(/* webpackChunkName: "FourOhFour" */ '../views/errors/FourOhFour.vue'),
}]

export function createRouter () {
  return new VueRouter({
    routes: [{
      path: '/',
      component: lazyLoad('index'),
      children: musicRoutes,
      redirect: { path: '/now' },
    }],
  })
}
