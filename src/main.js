import Vue from 'vue';
import App from '@/App.vue';
import { createRouter } from './router';
import { createStore } from './store';
import { createVuetify } from './vuetify';
import { createI18n } from './i18n';
import { createPlayer } from './player';

import Toast from './components/default/Toast';
import plugins from './plugins';
import filters from './filters';
import '@/scss/global.scss';
import '@/scss/animation.scss';
// import '@/mock/index';
import { mdiClose } from '@mdi/js';

Vue.config.productionTip = false;

// register vue filter
Object.entries(filters).map(([key, fn]) => {
  Vue.filter(key, fn);
});
Vue.use(plugins);

const store = createStore();
const vuetify = createVuetify(store);
const i18n = createI18n(store);
const router = createRouter(vuetify, store);
const player = createPlayer(store);

Vue.use(
  Toast,
  {
    x: 'center',
    showClose: true,
    closeIcon: mdiClose,
  },
  vuetify,
);

if (process.env.IS_ELECTRON) {
  import('./electron/ipcRenderer').then(
    ({ registerIpcRenderer, default: ipcRenderer }) => {
      registerIpcRenderer(store, router);
      Vue.prototype.$ipcRenderer = ipcRenderer;
    },
  );
}
const app = new Vue({
  store,
  router,
  i18n,
  vuetify,
  player,
  render: (h) => h(App),
});
app.$mount('#app');

// 挂载到window上，便于在非vue实例中也能 通过app.$*** 调用全局实例方法
window.app = app;
