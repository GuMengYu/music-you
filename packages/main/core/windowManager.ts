import { app, BrowserWindow, shell } from 'electron'
import is from 'electron-is'
import { EventEmitter } from 'events'
import { join } from 'path'

import { WindowState } from '../../renderer/src/util/enum'

export default class WindowManager extends EventEmitter {
  window: BrowserWindow | null
  willQuit: boolean
  constructor() {
    super()

    this.window = null

    this.willQuit = false
  }
  async openWindow() {
    if (this.window) {
      this.window?.show()
      this.window?.focus()
      return this.window
    }

    try {
      this.window = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 540,
        titleBarStyle: 'hiddenInset',
        // frame: !(is.windows() || is.linux()),
        webPreferences: {
          preload: join(__dirname, '../preload/index.cjs'),
          // Use pluginOptions.nodeIntegration, leave this alone
          // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          contextIsolation: false, // https://www.electronjs.org/zh/docs/latest/breaking-changes#%E9%BB%98%E8%AE%A4%E6%9B%B4%E6%94%B9-contextisolation-%E9%BB%98%E8%AE%A4%E4%B8%BA-true
        },
      })
      await this.loadURL()

      this.initWindowListener()
      return this.window
    } catch (e) {
      console.log(e)
    }
  }
  initWindowListener() {
    this.window?.on('enter-full-screen', () => {
      console.log('enter-full-screen')
      this.window?.webContents.send('fullscreen', true)
    })
    this.window?.on('leave-full-screen', () => {
      console.log('leave-full-screen')
      this.window?.webContents.send('fullscreen', false)
    })
    this.window?.on('close', (event) => {
      if (!this.willQuit) {
        event.preventDefault()
        if (this.window?.isFullScreen()) {
          this.window?.once('leave-full-screen', () => this.window?.hide())
          this.window?.setFullScreen(false)
        } else {
          this.window?.hide()
        }
      }
    })
    this.window?.on('maximize', () => {
      console.log('window maximize')
      this.window?.webContents.send('windowState', WindowState.MAXIMIZED)
    })
    this.window?.on('unmaximize', () => {
      console.log('window unmaximize')
      this.window?.webContents.send('windowState', WindowState.NORMAL)
    })
    this.window?.on('minimize', () => {
      console.log('window minimize')
      this.window?.webContents.send('windowState', WindowState.MINIMIZED)
    })
    this.window?.on('restore', () => {
      console.log('window restore')
      this.window?.webContents.send('windowState', WindowState.NORMAL)
    })

    // Test active push message to Renderer-process
    this.window?.webContents.on('did-finish-load', () => {
      this.window?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    this.window?.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
    })
  }
  async loadURL() {
    if (app.isPackaged) {
      this.window?.loadFile(join(__dirname, '../renderer/index.html'))
    } else {
      // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
      const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

      this.window?.loadURL(url)
      this.window?.webContents.openDevTools()
    }
  }
}
