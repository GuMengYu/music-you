import type { BrowserWindow } from 'electron'

const { ipcMain, shell } = require('electron')
import { downloadFile } from './util/download'
export const registerIpcMain = (window: BrowserWindow) => {
  ipcMain.handle('zoom-window', () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle('downloadFile', (_e, data) => {
    console.log('start download file', data.url)
    downloadFile(data)
  })
  ipcMain.handle('minimize', () => {
    window.minimize()
  })
  ipcMain.handle('maximize', () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle('close', () => {
    window.close()
  })
  ipcMain.handle('open-url', (e, url) => {
    shell.openExternal(url)
  })
}
