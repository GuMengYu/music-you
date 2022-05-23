import type { BrowserWindow } from 'electron'
import { ipcMain, shell } from 'electron'

import { WindowState } from '../../renderer/src/util/enum'
import { downloadFile } from './util/download'
import log from './util/log'
export const registerIpcMain = (window: BrowserWindow) => {
  ipcMain.handle('zoom-window', () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle('downloadFile', (_e, data) => {
    log.info('start download file', data.url)
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
    try {
      shell.openExternal(url)
    } catch (e) {
      log.error('open external url failed', e)
    }
  })
  ipcMain.handle('capturePage', async () => {
    const nativeImage = await window.capturePage()
    const buffer = nativeImage.toBitmap()
    const { width, height } = nativeImage.getSize()
    const result = {
      buffer,
      width,
      height,
    }
    return result
  })
}
