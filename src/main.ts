import './styles/animate.scss'
import './styles/global.scss'
import './styles/utility.scss'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import './util/pipLyric'

import { invoke } from '@tauri-apps/api/tauri'
import { createApp } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'

import { sleep } from '@/util/fn'

import App from './App.vue'
// directives
import { useDirectives } from './directives'
// plugins
import { useContextMenu } from './plugins/contextmenu'
import { useDayjs } from './plugins/dayjs'
import { useI18n } from './plugins/i18n'
import { usePinia } from './plugins/pinia'
import { usePlayer } from './plugins/player'
import { useTauri } from './plugins/tauri'
import { useToast } from './plugins/toast'
import { useVuetify } from './plugins/vuetify'
import { useFonts } from './plugins/webfontloader'
import { useRouter } from './router'

// 加载css fonts等资源
useFonts()
const app = createApp(App)
const router = useRouter(app)
const pinia = usePinia(app)
app.use(VueVirtualScroller)
useVuetify(app)
useI18n(app)
usePlayer(app)
useToast(app)
useDirectives(app)
useDayjs(app)
useTauri(router)
useContextMenu(app)
app.mount('#app').$nextTick(async () => {
  console.log('invoke close_splashscreen')
  await invoke('close_splashscreen')
})
