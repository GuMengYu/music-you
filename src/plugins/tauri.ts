import { listen, TauriEvent } from '@tauri-apps/api/event'
import { type } from '@tauri-apps/api/os'
import { appWindow } from '@tauri-apps/api/window'
import type { Router } from 'vue-router'

import { useAppStore } from '@/store/app'
import { WindowState } from '@/util/enum'

export const useTauri = async (router: Router) => {
  const store = useAppStore()
  store.$state.isDesktop = true
  store.$state.platformType = await type()
  await listen(TauriEvent.WINDOW_RESIZED, async (e) => {
    const isMaximized = await appWindow.isMaximized()
    if (isMaximized) {
      store.$state.windowState = WindowState.MAXIMIZED
    } else {
      store.$state.windowState = WindowState.NORMAL
    }
  })
}
