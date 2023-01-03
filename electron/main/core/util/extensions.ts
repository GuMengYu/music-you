import devtoolsInstaller from 'electron-devtools-installer'
import is from 'electron-is'

import log from './log'
export async function installExtensions() {
  if (is.dev() && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // @ts-ignore
      const { VUEJS3_DEVTOOLS, default: installExtension } = devtoolsInstaller
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      log.error('Vue Devtools failed to install:', e)
    }
  }
}
