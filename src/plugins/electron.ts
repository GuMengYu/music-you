import { useIpcRenderer } from '@vueuse/electron'
import { once } from 'lodash-es'
import { useToast } from 'vue-toastification'

import { usePlayerOutsideComponent } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'

const toast = useToast()
import type { Router } from 'vue-router'

import is from '@/util/is'

export function useElectron(router: Router) {
  if (is.electron()) {
    registerIpcRenderer(router)
  }
}

function registerIpcRenderer(router: Router) {
  const playerStore = usePlayerStore()
  const appStore = useAppStore()
  const ipcRenderer = useIpcRenderer()
  const player = usePlayerOutsideComponent()
  const showDownloadComplete = once((name) => {
    toast.success(`下载成功 ${name}`)
  })

  ipcRenderer.on('open-settings', () => {
    console.log(router)
    router.push({ name: 'setting' })
    // appStore.$state.showControlCenter = !appStore.$state.showControlCenter
  })
  // ipcRenderer.on('search', () => {
  //   appStore.$state.showSearch = !appStore.$state.showSearch
  // })
  ipcRenderer.on('next', () => {
    player.next()
  })
  ipcRenderer.on('prev', () => {
    player.prev()
  })
  ipcRenderer.on('playOrPause', () => {
    playerStore.$state.playing = !playerStore.$state.playing
  })
  ipcRenderer.on('volumeUp', () => {
    const volume = playerStore.$state.volume
    const tem = volume + 0.05
    if (tem < 1) {
      playerStore.$state.volume = tem
    }
  })
  ipcRenderer.on('volumeDown', () => {
    const volume = playerStore.$state.volume
    const tem = volume - 0.05
    if (tem >= 0) {
      playerStore.$state.volume = tem
    }
  })
  ipcRenderer.on('fullscreen', (e, fullscreen) => {
    // appStore.$state.showLyricsPage = fullscreen
  })
  ipcRenderer.on('startDownload', (e, data) => {
    console.log('startDownload', e, data)
    // window?.app?.$toast(`开始下载 ${data.name}`, {
    //   color: 'info',
    // })
  })
  ipcRenderer.on('downloadProgress', (e, data) => {
    const { percent } = data
    // playerStore.commit('app/downloadprogress', percent)
  })
  ipcRenderer.on('downloadCompleted', (e, file, fileName) => {
    const { path } = file
    toast.success(`${fileName} 已下载到:${path}`)

    // playerStore.commit('app/downloadprogress', 0)
  })
  ipcRenderer.on('windowState', (e, state) => {
    appStore.$state.windowState = state
  })
}
