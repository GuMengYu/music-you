const { app, Menu } = require('electron');
const isMac = process.platform === 'darwin';
export const createElectronMenu = window => {
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
                  // todo open settings
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
            window.webContents.openDevTools();
          },
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'close' },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
