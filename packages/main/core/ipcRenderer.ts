import { ipcRenderer } from 'electron'
import { noop, once } from 'lodash-es'

export const registerIpcRenderer = (store) => {
  const showDownloadComplete = once((name) => {
    window?.app?.$toast(`下载成功 ${name}`, {
      color: 'success',
    })
  })

  ipcRenderer.on('open-settings', () => {
    store.commit('app/showSettings', !store.state.app.showSettings)
  })
  ipcRenderer.on('search', () => {
    store.commit('app/showSearch', !store.state.app.showSearch)
  })
  ipcRenderer.on('next', () => {
    window?.app?.$player.next()
  })
  ipcRenderer.on('prev', () => {
    window?.app?.$player.prev()
  })
  ipcRenderer.on('playOrPause', () => {
    window?.app?.$player.togglePlay()
  })
  ipcRenderer.on('volumeUp', () => {
    const { volume } = store?.state.settings
    const tem = volume + 0.05
    if (tem < 1) {
      store.commit('settings/volume', tem)
    }
  })
  ipcRenderer.on('volumeDown', () => {
    const { volume } = store?.state.settings
    const tem = volume - 0.05
    if (tem >= 0) {
      store.commit('settings/volume', tem)
    }
  })
  ipcRenderer.on('like', () => {})
  ipcRenderer.on('fullscreen', (e, fullscreen) => {
    store.commit('music/showLyricsPage', fullscreen)
  })
  ipcRenderer.on('startDownload', (e, data) => {
    console.log('startDownload', e, data)
    window?.app?.$toast(`开始下载 ${data.name}`, {
      color: 'info',
    })
  })
  ipcRenderer.on('downloadProgress', (e, data) => {
    const { percent } = data
    console.log(percent)
    store.commit('app/downloadprogress', percent)
  })
  ipcRenderer.on('downloadCompleted', (e, file) => {
    const { fileName } = file
    console.log(file)
    showDownloadComplete(fileName)
    store.commit('app/downloadprogress', 0)
  })
  ipcRenderer.on('windowState', (e, state) => {
    store.commit('app/windowState', state)
  })
  return ipcRenderer
}

export default {
  async invoke(channel, data = {}, cb = noop) {
    const res = ipcRenderer.invoke(channel, data)
    cb(res)
  },
  subscribe: (channel, cb = noop) => {
    ipcRenderer.on(channel, cb)
  },
  remove(channel) {
    ipcRenderer.removeAllListeners(channel)
  },
}
