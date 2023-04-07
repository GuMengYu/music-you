import log from 'electron-log'

import { name } from '../../../../package.json'

log.transports.file.level = 'info'

export const logPath = {
  linux: `~/.config/${name}/logs`,
  darwin: `~/Library/Logs/${name}/`,
  win32: `%USERPROFILE%\\AppData\\Roaming\\${name}\\logs`,
}[process.platform as 'darwin' | 'win32' | 'linux']

export default log
