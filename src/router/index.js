import Vue from 'vue'
import VueRouter from 'vue-router'

const lazyLoad = name => () => import(/* webpackChunkName: "page" */ `../views/${name}`)

Vue.use(VueRouter)
const musicRoutes = [{
  path: 'now/',
  name: 'now',
  component: lazyLoad('Now'),
  meta: { keepAlive: true },
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
