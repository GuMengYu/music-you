import { createApp } from 'vue'

import App from './App.vue'
import { useDirectives } from './directives'
// plugins
import { useI18n } from './plugins/i18n'
import { usePinia } from './plugins/pinia'
import { usePlayer } from './plugins/player'
import { useVuetify } from './plugins/vuetify'
import { useFonts } from './plugins/webfontloader'
import { useRouter } from './router'

// 加载css fonts等资源
await useFonts()
import './styles/animate.scss'
import './styles/global.scss'

const app = createApp(App)

usePinia(app)
useRouter(app)
useVuetify(app)
useI18n(app)
usePlayer(app)
useDirectives(app)
app.mount('#app')
