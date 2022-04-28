import type { App } from 'vue'

import Toast, { injectVuetify } from '@/components/app/toast/toast'

export default Toast
//
const ToastWithInstall = {
  install(app: App, options: any) {
    injectVuetify(options.vuetify)
    app.config.globalProperties.$toast = Toast
  },
}

export function useToast(app: App, vuetify: any) {
  app.use(ToastWithInstall, {
    components: {
      Toast,
    },
    options: {
      vuetify,
    },
  })
}
