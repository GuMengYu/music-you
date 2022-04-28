import { createApp } from 'vue'

import App from './App.vue'
// directives
import { useDirectives } from './directives'
// plugins
import { useElectron } from './plugins/electron'
import { useI18n } from './plugins/i18n'
import { usePinia } from './plugins/pinia'
import { usePlayer } from './plugins/player'
import { useVuetify } from './plugins/vuetify'
import { useFonts } from './plugins/webfontloader'
import { useRouter } from './router'

// 加载css fonts等资源
useFonts()
import './styles/animate.scss'
import './styles/global.scss'

const app = createApp(App)

useVuetify(app)
usePinia(app)
useRouter(app)
useI18n(app)
usePlayer(app)
useDirectives(app)
useElectron()
app.mount('#app').$nextTick(() => {
  window.removeLoading()
})
