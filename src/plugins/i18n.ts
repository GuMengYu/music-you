import { createI18n } from 'vue-i18n'
import zh from '@/i18n/messages/zh';
import en from '@/i18n/messages/en';
import type { App } from 'vue'

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
