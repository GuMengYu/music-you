'use strict';
/* global __static */
import path from 'path';
import Express from 'express';
import { app, protocol, BrowserWindow } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import is from 'electron-is';

import { createElectronMenu } from './electron/menu';
import { createTray } from './electron/tray';
import { createApiServer } from './electron/neteaseapi/apiserver';
import { registerIpcMain } from './electron/ipcMain';
import WindowManager from './electron/windowManager';
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let appProxy = null;
let windowManager = null;

start();
app.setAboutPanelOptions({
  applicationName: 'VPlayer音乐播放器',
  iconPath: path.join(__static, 'icon.ico'),
  applicationVersion: '0.2.3',
  copyright: 'Copyright © 2022',
});

function start() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    return app.quit();
  } else {
    app.on('second-instance', () => {
      // 当运行第二个实例时,将会聚焦到前一个实例的窗口
      if (windowManager.window) {
        windowManager.window.show();
        if (windowManager.window.isMinimized()) windowManager.window.restore();
        windowManager.window.focus();
      }
    });
  }
  handleAppEvent();
}
function handleAppEvent() {
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS, it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On macOS, it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) windowManager.openWindow();
    else windowManager.window.show();
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async () => {
    if (is.dev() && !process.env.IS_TEST) {
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS);
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString());
      }
    }
    // Exit cleanly on request from parent process in development mode.
    if (is.dev()) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit();
          }
        });
      } else {
        process.on('SIGTERM', () => {
          app.quit();
        });
      }
    }
    createApiServer();
    is.production() && createProxyServer();
    windowManager = new WindowManager();
    const window = await windowManager.openWindow();
    createElectronMenu(window);
    is.windows && createTray(window);
    registerIpcMain(window);
  });
  app.on('quit', () => {
    appProxy && appProxy.close();
  });
  app.on('before-quit', () => {
    windowManager.willQuit = true;
  });
}

function createProxyServer() {
  const app = new Express();
  app.use('/', Express.static(__dirname + '/'));
  appProxy = app.listen(12137, '', () => {
    console.log('app run in port 12137');
  });
}

export const getWin = () => windowManager.window;
