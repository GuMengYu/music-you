import { createPinia } from 'pinia'
// types 

import { App } from 'vue'

export const pinia = createPinia()
export const usePinia = (app: App) => {
    app.use(pinia)
}