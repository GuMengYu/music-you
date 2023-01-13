import { createPinia } from 'pinia'
// types
import type { App } from 'vue'

export const pinia = createPinia()
export const usePinia = (app: App) => {
  app.use(pinia)
  return pinia
}
