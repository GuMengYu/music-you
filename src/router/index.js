import Vue from 'vue'
import VueRouter from 'vue-router'
const lazyLoad = name => () => import(/* webpackChunkName: "page" */ `../views/${name}/index.vue`);

Vue.use(VueRouter)
const musicRoutes = [{
  path: 'now/',
  name: 'now',
  component: lazyLoad('listen-now'),
  meta: {keepAlive: true},
}, {
  path: 'playlist/:id/',
  name: 'playlist',
  component: lazyLoad('playlist'),
  props: true,
  meta: {keepAlive: true},
},{
  path: '*',
  name: '404',
  component: () => import(/* webpackChunkName: "404" */ '../views/errors/404.vue'),
}];

export function createRouter() {
  return new VueRouter({
    routes: [{
      path: '/',
      component: () => import(/* webpackChunkName: "page" */ '../views/index.vue'),
      children: musicRoutes,
      redirect: { path: '/now' },
    }],
  });
}
