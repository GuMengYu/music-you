import type { App } from 'vue'
import { createContextMenu } from 'vuetify-ctx-menu/lib/main'

export function useContextMenu(app: App) {
  const ctx = createContextMenu()
  app.use(ctx)
}
