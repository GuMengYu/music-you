import { app } from 'electron'
import { download } from 'electron-dl'

import { getWin } from '../../index'
import log from './log'
export const downloadFile = (data: { fileName?: string; url: string }) => {
  const win = getWin()
  const downloadLocation = app.getPath('downloads')
  const fileName = data.fileName || data.url.split('/').pop()
  if (win) {
    download(win, data.url, {
      directory: downloadLocation,
      showBadge: false,
      filename: fileName,
      onStarted(item) {
        win.webContents.send('startDownload', { name: item.getFilename() })
      },
      onProgress(progress) {
        progress.percent = (progress.transferredBytes / progress.totalBytes) * 100
        win.webContents.send('downloadProgress', progress)
      },
      onCompleted(file) {
        win.webContents.send('downloadCompleted', file)
      },
    })
  } else {
    log.warn('not found window')
  }
}
