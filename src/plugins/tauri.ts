import { listen, TauriEvent } from '@tauri-apps/api/event'
import { type } from '@tauri-apps/api/os'
import { appWindow } from '@tauri-apps/api/window'
import type { Router } from 'vue-router'
import { useToast } from 'vue-toastification'

import { usePlayerOutsideComponent } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { WindowState } from '@/util/enum'

let toast: any
export const useTauri = async (router: Router) => {
  toast = useToast()
  await registerCommands(router)
}

async function registerCommands(router: Router) {
  const playerStore = usePlayerStore()
  const appStore = useAppStore()
  appStore.$state.isDesktop = true
  appStore.$state.platformType = await type()
  const player = usePlayerOutsideComponent()

  await listen('music-you://notice-message', ({ payload }) => {
    const [status, msg] = payload as Array<string>
    toast.info(msg)
  })
  await listen(TauriEvent.WINDOW_RESIZED, async (e) => {
    const isMaximized = await appWindow.isMaximized()
    if (isMaximized) {
      appStore.$state.windowState = WindowState.MAXIMIZED
    } else {
      appStore.$state.windowState = WindowState.NORMAL
    }
  })

  await listen('music-you://tray_control', ({ payload }) => {
    switch (payload) {
      case 'open_setting':
        router.push({ name: 'setting' })
        break
      case 'next_track':
        player.next()
        break
      case 'prev_track':
        player.prev()
        break
      case 'fav_track':
        toast.info('🚧施工中...')
        break
      case 'toggle_play':
        playerStore.$state.playing = !playerStore.$state.playing
        break
      case 'volume_up':
        {
          const volume = playerStore.$state.volume
          const tem = volume + 0.05
          if (tem < 1) {
            playerStore.$state.volume = tem
          }
        }
        break
      case 'volume_down':
        {
          const volume = playerStore.$state.volume
          const tem = volume - 0.05
          if (tem >= 0) {
            playerStore.$state.volume = tem
          }
        }
        break
    }
  })
  // await listen('startDownload', (e) => {
  //   console.log('startDownload', e)
  //   // window?.app?.$toast(`开始下载 ${data.name}`, {
  //   //   color: 'info',
  //   // })
  // })
  // await listen('downloadProgress', (e) => {})
  // await listen('downloadCompleted', (e) => {
  //   const { path, fileName } = e
  //   toast.success(`${fileName} 已下载到:${path}`, {
  //     timeout: 5000,
  //   })
  // })
}
