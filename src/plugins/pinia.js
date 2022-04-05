import { createPinia } from 'pinia'

export const pinia = createPinia()
export const usePinia = (app) => {
    app.use(pinia)
}