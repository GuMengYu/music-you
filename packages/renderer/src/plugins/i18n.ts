import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import { useSettingStore } from '@/store/setting'

import en from '../locale/en.json'
import zhCN from '../locale/zh-CN.json'

// const messages = Object.fromEntries(
//     Object.entries(
//         import.meta.globEager('../i18n/messages/*.json'))
//         .map(([key, value]) => {
//             return [key.slice(key.lastIndexOf('/') + 1, -5), value.default]
//         }),
// )

export const useI18n = (app: App) => {
  const settingStore = useSettingStore()
  const locale = settingStore.locale

  const i18n = createI18n({
    allowComposition: true, // you need to specify that!
    locale,
    messages: { zhCN, en },
  })
  app.use(i18n)
  return i18n
}
