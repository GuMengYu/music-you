import { createApp } from 'vue'

import App from './App.vue'
import { useI18n } from './plugins/i18n'
import { pinia, usePinia } from './plugins/pinia'
import { usePlayer } from './plugins/player'
import { useVuetify } from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
// plugins
import { useRouter } from './router'

// 加载css fonts等资源
loadFonts()
import 'animate.css'
import './styles/global.scss'

const app = createApp(App)

usePinia(app)
useRouter(app)
useVuetify(app)
useI18n(app)
usePlayer(app)

app.mount('#app')
