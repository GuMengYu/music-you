import { ipcRenderer } from 'electron'
import { useSnackbar } from 'notistack'

import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import router from '@/router'

// const toast = useSnackbar()

import is from '@/util/is'

export function useElectron() {
  console.log('register electron ipc renderer')
  if (is.electron()) {
    registerIpcRenderer()
  }
}

function registerIpcRenderer() {
  // const playerStore = usePlayerStore()
  // const appStore = useAppStore()
  // const player = usePlayerOutsideComponent()
  // // const showDownloadComplete = once((name) => {
  // //   toast.success(`下载成功 ${name}`)
  // // })
  // let cacheVolume = 0.8
  ipcRenderer.on('open-route', (_, path) => {
    router.navigate(path)
    // router.push({ name: routeName })
  })
  // // ipcRenderer.on('search', () => {
  // //   appStore.$state.showSearch = !appStore.$state.showSearch
  // // })
  // ipcRenderer.on('next', () => {
  //   player.next()
  // })
  // ipcRenderer.on('prev', () => {
  //   player.prev()
  // })
  // ipcRenderer.on('playOrPause', () => {
  //   player.togglePlay()
  //   // playerStore.$state.playing = !playerStore.$state.playing
  // })
  // ipcRenderer.on('volumeUp', () => {
  //   const volume = playerStore.$state.volume
  //   const tem = volume + 0.05
  //   if (tem < 1) {
  //     playerStore.$state.volume = tem
  //   }
  // })
  // ipcRenderer.on('volumeDown', () => {
  //   const volume = playerStore.$state.volume
  //   const tem = volume - 0.05
  //   if (tem >= 0) {
  //     playerStore.$state.volume = tem
  //   }
  // })
  // ipcRenderer.on('mute', () => {
  //   if (playerStore.$state.volume === 0) {
  //     playerStore.$state.volume = cacheVolume
  //   } else {
  //     cacheVolume = playerStore.$state.volume
  //     playerStore.$state.volume = 0
  //   }
  // })
  // ipcRenderer.on('search', () => {
  //   router.push({ name: 'search' })
  // })
  // ipcRenderer.on('fullscreen', (e, fullscreen) => {
  //   // appStore.$state.showLyricsPage = fullscreen
  // })
  // ipcRenderer.on('startDownload', (e, data) => {
  //   // console.log('startDownload', e, data)
  //   // window?.app?.$toast(`开始下载 ${data.name}`, {
  //   //   color: 'info',
  //   // })
  // })
  // ipcRenderer.on('downloadProgress', (e, data) => {
  //   const { percent } = data
  //   // playerStore.commit('app/downloadprogress', percent)
  // })
  // ipcRenderer.on('downloadCompleted', (e, file, fileName) => {
  //   const { path } = file
  //   toast.success(`${fileName} 已下载到:${path}`, {
  //     timeout: 2500,
  //   })
  //
  //   // playerStore.commit('app/downloadprogress', 0)
  // })
  // ipcRenderer.on('windowState', (e, state) => {
  //   appStore.$state.windowState = state
  // })
}
