'use strict';
/* global __static */
import path from 'path';
import Express from 'express';
import { app, protocol, BrowserWindow } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { createElectronMenu } from '../electron/menu';
import { startApiServer } from '../electron/apiserver';
import { registerIpcMain } from '../electron/ipcMain';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);
let _app = null;
let win = null;
let quitFlag = process.platform !== 'darwin';
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1220,
    height: 720,
    minWidth: 1160,
    minHeight: 530,
    titleBarStyle: 'hidden',
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      // preload: __dirname + '/preload.js',
    },
    icon: path.join(__static, 'icon.png'),
  });
  // hide menu bar on Windows and Linux
  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('http://localhost:12137');
  }
  createElectronMenu(win);
  win.on('minimize', () => {
    win.hide();
  });
  win.on('close', (e) => {
    console.log('window close');
    if (quitFlag) {
      app.quit();
      win = null;
    } else {
      e.preventDefault();
      win.hide();
    }
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
  else win.show();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  startApiServer();
  await createServer();
  await createWindow();
  registerIpcMain(win);
});
app.setAboutPanelOptions({
  applicationName: 'VPlayer',
  iconPath: path.join(__static, 'icon.png'),
  applicationVersion: '0.1.0-alpha',
  copyright: 'Copyright © 2021',
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
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
app.on('quit', () => {
  _app && _app.close();
});
app.on('before-quit', () => {
  quitFlag = true;
});

function createServer() {
  const app = new Express();
  app.use('/', Express.static(__dirname + '/'));
  _app = app.listen(12137, '', () => {
    console.log('app run in port 12137');
  });
}
