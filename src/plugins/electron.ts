import { ipcRenderer } from 'electron'
import { enqueueSnackbar } from 'notistack'
import { player } from '@/contexts/player'
import router from '@/router'

// const toast = useSnackbar()

import is from '@/util/is'

export function useElectron() {
  if (is.electron())
    registerIpcRenderer()

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
  ipcRenderer.on('next', () => {
    player.next()
  })
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
  ipcRenderer.on('startDownload', (e, data) => {
    // console.log('startDownload', e, data)
    // window?.app?.$toast(`开始下载 ${data.name}`, {
    //   color: 'info',
    // })
  })
  // ipcRenderer.on('downloadProgress', (e, data) => {
  //   const { percent } = data
  //   // playerStore.commit('app/downloadprogress', percent)
  // })
  ipcRenderer.on('downloadCompleted', (e, file, fileName) => {
    const { path } = file
    enqueueSnackbar(`${fileName} 已下载到:${path}`, {
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      variant: 'success',
    })
  })
  //
  //   // playerStore.commit('app/downloadprogress', 0)
  // })
  // ipcRenderer.on('windowState', (e, state) => {
  //   appStore.$state.windowState = state
  // })
  ipcRenderer.on('snackbar-add-tracks', (e, data, data2) => {
    console.log(data, data2)
  })
  ipcRenderer.on('snackbar-indexing', (e, indexing) => {
    if (indexing === 'start')
      enqueueSnackbar({ message: '开始检索歌曲', variant: 'warning', autoHideDuration: 3000 })


    else if (indexing === 'end')
      enqueueSnackbar({ message: '检索完成', variant: 'warning', autoHideDuration: 1000 })



  })
}
