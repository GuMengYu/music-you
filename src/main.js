import { createApp } from 'vue'
import { loadFonts } from './plugins/webfontloader'
import App from './App.vue'

// plugins
import { useRouter } from './router'
import { pinia, usePinia } from './plugins/pinia'
import { useVuetify } from './plugins/vuetify'
import { useI18n } from './plugins/i18n'

// 加载css fonts等资源
loadFonts()
import 'animate.css'

const app = createApp(App)

usePinia(app)
useRouter(app)
useVuetify(app)
useI18n(app)

app.mount('#app')
