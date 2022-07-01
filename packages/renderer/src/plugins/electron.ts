import { useIpcRenderer } from '@vueuse/electron'
import { once } from 'lodash-es'

import { usePlayerOutsideComponent } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import is from '@/util/is'

export function useElectron() {
  if (is.electron()) {
    registerIpcRenderer()
  }
}

function registerIpcRenderer() {
  const playerStore = usePlayerStore()
  const appStore = useAppStore()
  const ipcRenderer = useIpcRenderer()
  const player = usePlayerOutsideComponent()
  // const showDownloadComplete = once((name) => {})

  // ipcRenderer.on('open-settings', () => {
  // appStore.$state.showControlCenter = !appStore.$state.showControlCenter
  // })
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
    console.log(percent)
    // playerStore.commit('app/downloadprogress', percent)
  })
  ipcRenderer.on('downloadCompleted', (e, file) => {
    const { fileName } = file
    console.log(file)
    // showDownloadComplete(fileName)
    // playerStore.commit('app/downloadprogress', 0)
  })
  ipcRenderer.on('windowState', (e, state) => {
    appStore.$state.windowState = state
  })
}
