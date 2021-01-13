import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import plugins from './plugins';
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
  vuetify,
  render: h => h(App),
}).$mount('#app')
