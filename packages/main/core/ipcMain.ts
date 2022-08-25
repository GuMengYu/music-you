import type { BrowserWindow } from 'electron'
import { app, ipcMain, shell } from 'electron'

import { WindowState } from '../../renderer/src/util/enum'
import { downloadFile } from './util/download'
import log from './util/log'
import { WindowDefaultSize } from './windowManager'
export const registerIpcMain = (window: BrowserWindow) => {
  ipcMain.handle('zoom-window', () => {
    if (window.isMaximized()) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })
  ipcMain.handle('downloadFile', (_e, data) => {
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
    app.quit()
  })
  ipcMain.handle(WindowState.MINIMIZEDTRAY, () => {
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
  let cacheSize: number[] = []
  ipcMain.handle('adjustWidth', async () => {
    const aspectRatio = 2
    const [width, height] = window.getSize()
    console.log('adjustWidth: current', width, height)
    cacheSize = [width, height]
    const resizedWidth = height * aspectRatio
    if (resizedWidth !== width) {
      window.setSize(resizedWidth, height, true)
    }
    console.log('adjustWidth: resized', resizedWidth)

    return resizedWidth
  })
  ipcMain.handle('restoreSize', () => {
    const [width, height] = cacheSize
    if (width && height) {
      window.setSize(width, height, true)
    } else {
      window.setSize(WindowDefaultSize.width, WindowDefaultSize.height, true)
    }
  })
  ipcMain.handle('setProgress', (e, progress) => {
    window.setProgressBar(progress)
  })
}
