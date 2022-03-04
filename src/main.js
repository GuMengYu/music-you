import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { createRouter } from './router'
import { createI18n } from './i18n/index'
import { loadFonts } from './plugins/webfontloader'

const router = createRouter()
const i18n = createI18n()
loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(i18n)
  .mount('#app')
