import type { App } from 'vue'
import ctxmenu from 'vuetify-ctx-menu/lib/main'

export function useContextMenu(app: App) {
  app.use(ctxmenu)
}
