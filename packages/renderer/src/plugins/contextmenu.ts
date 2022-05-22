import type { App } from 'vue'

import contextMenu from './contextMenu/ContextMenuInstance'

export function useContextMenu(app: App) {
  app.use(contextMenu)
}
