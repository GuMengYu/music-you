import { EventEmitter } from 'events';
import is from 'electron-is';
import { BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

const defaultOptions = {
  width: 1270,
  height: 720,
  minWidth: 800,
  minHeight: 540,
  titleBarStyle: 'hiddenInset',
  frame: !(is.windows() || is.linux()),
};

export default class WindowManager extends EventEmitter {
  constructor() {
    super();

    this.window = null;

    this.willQuit = false;
  }
  async openWindow() {
    if (this.window) {
      this.window.show();
      this.window.focus();
      return this.window;
    }

    try {
      this.window = new BrowserWindow({
        ...defaultOptions,
        webPreferences: {
          // Use pluginOptions.nodeIntegration, leave this alone
          // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
          nodeIntegration: true,
          nodeIntegrationInWorker: true,
          contextIsolation: false, // https://www.electronjs.org/zh/docs/latest/breaking-changes#%E9%BB%98%E8%AE%A4%E6%9B%B4%E6%94%B9-contextisolation-%E9%BB%98%E8%AE%A4%E4%B8%BA-true
        },
        bindCloseToHide: true,
      });
      await this.loadURL();

      this.initWindowListener();
      return this.window;
    } catch (e) {
      console.log(e);
    }
  }
  initWindowListener() {
    this.window.on('enter-full-screen', () => {
      console.log('enter-full-screen');
      this.window.webContents.send('fullscreen', true);
    });
    this.window.on('leave-full-screen', () => {
      console.log('leave-full-screen');
      this.window.webContents.send('fullscreen', false);
    });
    this.window.on('close', (event) => {
      if (!this.willQuit) {
        event.preventDefault();
        if (this.window.isFullScreen()) {
          this.window.once('leave-full-screen', () => this.window.hide());
          this.window.setFullScreen(false);
        } else {
          this.window.hide();
        }
      }
    });
    this.window.on('maximize', () => {
      console.log('window maximize');
      this.window.webContents.send('windowState', 'maximize');
    });
    this.window.on('unmaximize', () => {
      console.log('window unmaximize');
      this.window.webContents.send('windowState', 'normal');
    });
    this.window.on('minimize', () => {
      console.log('window minimize');
      this.window.webContents.send('windowState', 'minimize');
    });
    this.window.on('restore', () => {
      console.log('window restore');
      this.window.webContents.send('windowState', 'normal');
    });
  }
  async loadURL() {
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      await this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      // if (!process.env.IS_TEST) this.window.webContents.openDevTools();
    } else {
      createProtocol('app');
      // Load the index.html when not in development
      this.window.loadURL('http://127.0.0.1:12137');
    }
  }
}
