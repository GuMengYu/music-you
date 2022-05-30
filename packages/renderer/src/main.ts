import { createApp } from 'vue'

import App from './App.vue'
// directives
import { useDirectives } from './directives'
// plugins
import { useContextMenu } from './plugins/contextmenu'
import { useDayjs } from './plugins/dayjs'
import { useElectron } from './plugins/electron'
import { useI18n } from './plugins/i18n'
import { usePinia } from './plugins/pinia'
import { usePlayer } from './plugins/player'
import { useToast } from './plugins/toast'
import { useVuetify } from './plugins/vuetify'
import { useFonts } from './plugins/webfontloader'
import { useRouter } from './router'

// 加载css fonts等资源
useFonts()
import './styles/animate.scss'
import './styles/global.scss'

import is from '@/util/is'

const app = createApp(App)

usePinia(app)
useVuetify(app)
useRouter(app)
useI18n(app)
usePlayer(app)
useToast(app)
useDirectives(app)
useDayjs(app)
useElectron()
useContextMenu(app)
app.mount('#app').$nextTick(() => {
  is.electron() && window.removeLoading()
})

console.log(import.meta.env)
