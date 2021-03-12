const {ipcMain} = require('electron');
export const registerIpcMain = (window) => {
  ipcMain.on('zoom-window', () => {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  })
}
