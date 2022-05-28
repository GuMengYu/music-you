import type { BrowserWindow } from 'electron'

const { app, Menu } = require('electron')
const isMac = process.platform === 'darwin'
export const createElectronMenu = (window: BrowserWindow) => {
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              {
                role: 'preferences',
                label: '偏好设置',
                accelerator: (() => (isMac ? 'CmdOrCtrl+,' : 'Ctrl+,'))(),
                click: () => {
                  window.webContents.send('open-settings')
                },
              },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            // todo open search
          },
        },
      ],
    },
    {
      label: '控制',
      submenu: [
        {
          label: '播放|暂停',
          accelerator: 'Space',
          click: () => {
            window.webContents.send('playOrPause')
          },
        },
        {
          label: '下一首',
          accelerator: 'CmdOrCtrl+Right',
          click: () => {
            window.webContents.send('next')
          },
        },
        {
          label: '上一首',
          accelerator: 'CmdOrCtrl+Left',
          click: () => {
            window.webContents.send('prev')
          },
        },
        {
          label: '升高音量',
          accelerator: 'CmdOrCtrl+Up',
          click: () => {
            window.webContents.send('volumeUp')
          },
        },
        {
          label: '降低音量',
          accelerator: 'CmdOrCtrl+Down',
          click: () => {
            window.webContents.send('volumeDown')
          },
        },
        {
          label: '喜欢|不喜欢',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            window.webContents.send('like')
          },
        },
        {
          label: '搜索',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            window.webContents.send('search')
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'reload' },
        { role: 'forcereload' },
        {
          label: 'devtools',
          accelerator: 'F12',
          click: () => {
            window.webContents.toggleDevTools()
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'close' },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}
