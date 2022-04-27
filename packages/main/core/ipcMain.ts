import type { BrowserWindow } from 'electron'

const { ipcMain, shell } = require('electron')
import { WindowState } from '../../renderer/src/util/enum'
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
  ipcMain.handle(WindowState.MINIMIZED, () => {
    window.minimize()
  })
  ipcMain.handle(WindowState.MAXIMIZED, () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle(WindowState.NORMAL, () => {
    window.unmaximize()
  })
  ipcMain.handle(WindowState.CLOSED, () => {
    window.close()
  })
  ipcMain.handle('open-url', (e, url) => {
    shell.openExternal(url)
  })
}
