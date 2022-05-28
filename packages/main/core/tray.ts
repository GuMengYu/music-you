/* global __static */
import type { BrowserWindow } from 'electron'
import { app, Menu, nativeImage, Tray } from 'electron'
import is from 'electron-is'
import { join } from 'path'

let tray = null
export const createTray = (win: BrowserWindow) => {
  const icon = nativeImage.createFromPath(join(__dirname, '../renderer', is.macOS() ? 'icon/icon.png' : 'icon.ico'))
  tray = new Tray(icon)
  tray.setToolTip('vplayer')
  const menu = Menu.buildFromTemplate([
    {
      label: '播放/暂停',
      click: () => {
        win.webContents.send('playOrPause')
      },
    },
    {
      label: '上一首',
      click: () => {
        win.webContents.send('prev')
      },
    },
    {
      label: '下一首',
      click: () => {
        win.webContents.send('next')
      },
    },
    {
      label: '设置',
      click: () => {
        win.webContents.send('open-settings')
      },
    },
    {
      label: '退出',
      click: () => {
        app.quit()
      },
    },
  ])
  tray.setContextMenu(menu)
  handleEvents(tray, win)
}

function handleEvents(tray, win) {
  tray.on('click', () => {
    win.show()
  })
}
