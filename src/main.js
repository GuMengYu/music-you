import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import plugins from './plugins';
import i18n from './i18n';
import './mock/index';
import filters from './filters';
import './scss/global.scss'
Vue.config.productionTip = false
Object.entries(filters).map(([key, fn]) => {
  Vue.filter(key, fn);
});

Vue.use(plugins);
new Vue({
  store,
  router,
  i18n: i18n(),
  vuetify,
  render: h => h(App),
}).$mount('#app')
