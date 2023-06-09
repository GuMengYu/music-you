import 'vue-toastification/dist/index.css'

import type { App } from 'vue'
import type { PluginOptions } from 'vue-toastification'
import Toast, { POSITION } from 'vue-toastification'

export function useToast(app: App) {
  const options: PluginOptions = {
    position: POSITION.BOTTOM_CENTER,
    timeout: 2000,
    hideProgressBar: true,
    showCloseButtonOnHover: true,
  }
  app.use(Toast, options)
}
