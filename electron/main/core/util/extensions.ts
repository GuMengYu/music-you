import devtoolsInstaller from 'electron-devtools-installer'
import is from 'electron-is'

import log from './log'
export async function installExtensions() {
  if (is.dev() && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { VUEJS_DEVTOOLS, default: installExtension } = devtoolsInstaller
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      log.error('Vue Devtools failed to install:', e)
    }
  }
}
