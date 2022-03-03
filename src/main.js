import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { createRouter } from './router'
import { loadFonts } from './plugins/webfontloader'

const router = createRouter()
loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
