import { app, BrowserWindow, protocol } from 'electron'
import is from 'electron-is'
import log from 'electron-log'
import type * as http from 'http'
import { release } from 'os'

import { useStaticServer } from './core/appStataicServer'
import { registerIpcMain } from './core/ipcMain'
import { createElectronMenu } from './core/menu'
import { useNetEaseApiServer } from './core/neteaseapi/apiserver'
import { createTray } from './core/tray'
import { installExtensions } from './core/util/extensions'
import WindowManager from './core/windowManager'

let appStaticServer: http.Server
let wm: WindowManager

preCheck()
bootstrap()

function bootstrap() {
  log.info('[main] bootstrap')
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    return app.quit()
  } else {
    app.on('second-instance', () => {
      // 当运行第二个实例时,将会聚焦到前一个实例的窗口
      const window = wm.getWindow('index')
      if (window) {
        window.show()
        if (window.isMinimized()) window.restore()
        window.focus()
      }
    })
  }
  handleAppEvent()
}

function handleAppEvent() {
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS, it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) wm.openWindow('index')
    else wm.getWindow('index')?.show()
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    // install extensions
    await installExtensions()
    // Exit cleanly on request from parent process in development mode.
    if (is.dev()) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }
    await useNetEaseApiServer({
      port: import.meta.env['VITE_API_SERVER_PORT'],
      host: import.meta.env['VITE_API_SERVER_HOST'],
    })
    if (is.production()) {
      // web静态资源express托管
      useStaticServer()
    }
    wm = new WindowManager()
    const window = await wm.openWindow('index')
    if (window) {
      createElectronMenu(window)
      createTray(window)
      registerIpcMain(wm)
    }
  })
  app.on('quit', () => {
    appStaticServer && appStaticServer.close()
  })
  app.on('before-quit', () => {
    wm.willQuit = true
  })
}

function preCheck() {
  // Scheme must be registered before the app is ready
  protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
  // Disable GPU Acceleration for Windows 7
  if (release().startsWith('6.1')) app.disableHardwareAcceleration()

  // Set application name for Windows 10+ notifications
  if (process.platform === 'win32') app.setAppUserModelId(app.getName())
}
export const getWin = () => wm.getWindow('index')
