import path from 'path'
import { EventEmitter } from 'events'
import is from 'electron-is'
import { app, shell, screen, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

const defaultOptions = {
    width: 1224,
    height: 768,
    minWidth: 900,
    minHeight: 560,
    titleBarStyle: 'hiddenInset',
    frame: !(is.windows() || is.linux()),
}

export default class WindowManager extends EventEmitter {
    constructor(option = {}) {
        super();

        this.window = null;

        this.willQuit = false;

    }
    async openWindow (options = {}) {
        if (this.window) {
          this.window.show()
          this.window.focus()
          return this.window
        }
    
        this.window = new BrowserWindow({
          ...defaultOptions,
          webPreferences: {
            enableRemoteModule: true,
             // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: true,
            nodeIntegrationInWorker: true
          },
          icon: path.join(__static, 'icon.png'),
          hasShadow: !is.macOS(),
          bindCloseToHide: true,
          transparent: !is.windows(),
        })
        this.loadURL();

        this.initWindowListener();

        return window
      }
      initWindowListener() {
        this.window.on('enter-full-screen', () => {
          console.log('enter-full-screen');
          win.webContents.send('fullscreen', true);
        });
        this.window.on('leave-full-screen', () => {
          console.log('leave-full-screen');
          win.webContents.send('fullscreen', false);
        });
        this.window.on('close', (event) => {
          if (!this.willQuit) {
            event.preventDefault()
            if (window.isFullScreen()) {
              window.once('leave-full-screen', () => win.hide())
              window.setFullScreen(false)
            } else {
              window.hide()
            }
          } else {
    
          }
        });
      }
      async loadURL() {
        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // Load the url of the dev server if in development mode
            await this.window.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
            if (!process.env.IS_TEST) this.window.webContents.openDevTools();
        } else {
            createProtocol('app');
            // Load the index.html when not in development
            this.window.loadURL('http://127.0.0.1:12137');
        }
      }
}