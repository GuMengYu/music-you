import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

import en from '@/i18n/messages/en'
import zh from '@/i18n/messages/zh'

// const messages = Object.fromEntries(
//     Object.entries(
//         import.meta.globEager('../i18n/messages/*.json'))
//         .map(([key, value]) => {
//             return [key.slice(key.lastIndexOf('/') + 1, -5), value.default]
//         }),
// )

export const useI18n = (app: App) => {
  const i18n = createI18n({
    locale: 'zh',
    messages: { zh, en },
  })
  app.use(i18n)
}
