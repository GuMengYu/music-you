import {execa} from 'execa'
import fs from 'node:fs'
import { oraPromise } from 'ora'

console.log(execa)

async function createServerPackage() {
  return execa('node_modules/.bin/pkg', [
    'node_modules/NeteaseCloudMusicApi/app.js',
    '--output',
    'src-tauri/binaries/app',
  ])
}

async function moveBinaries() {
  let extension = ''

  if (process.platform === 'win32') {
    extension = '.exe'
  }

  const rustInfo = (await execa('rustc', ['-vV'])).stdout
  const targetTriple = /host: (\S+)/g.exec(rustInfo)[1]

  if (!targetTriple) {
    console.error('Failed to determine platform target triple')
  }

  fs.renameSync(`src-tauri/binaries/app${extension}`, `src-tauri/binaries/app-${targetTriple}${extension}`)
}
async function main() {
  try {
    await createServerPackage()
    await moveBinaries()
  } catch (e) {
    throw e
  }
}

oraPromise(main, {
  text: 'Building server...\n',
  successText: 'Build server Done\n',
  failText: 'Cannot build server',
})
