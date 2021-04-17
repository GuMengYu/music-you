const { ipcMain } = require('electron');
import { downloadFile } from './util/download';
export const registerIpcMain = (window) => {
  ipcMain.handle('zoom-window', () => {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });
  ipcMain.handle('downloadFile', (e, data) => {
    console.log('start download file', data.url)
    downloadFile(data);
  });
  ipcMain.handle('minimize', (e, data) => {
    window.minimize();
  });
  ipcMain.handle('maximize', (e, data) => {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  });
  ipcMain.handle('close', (e, data) => {
    window.close();
  });
};
