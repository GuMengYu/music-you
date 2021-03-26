import Vue from 'vue';

import { createRouter } from '@/router';
import { createStore } from '@/store';
import { createVuetify } from '@/vuetify';
import { createI18n } from '@/i18n';

import { createSnackbar } from '@/plugins/snackbar';

import plugins from '@/plugins';
import filters from '@/filters';
import '@/scss/global.scss';
import '@/mock/index';

// Application
import App from '@/App.vue';

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
Vue.prototype.$message = createSnackbar(vuetify);

if (process.env.IS_ELECTRON) {
  import('./electron/ipcRenderer').then(({ registerIpcRenderer }) => {
    registerIpcRenderer(store, router);
  });
}
new Vue({
  store,
  router,
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
