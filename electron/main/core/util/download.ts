import { app } from 'electron'
import type { File } from 'electron-dl'
import { download } from 'electron-dl'
import { spawn } from 'node:child_process'
import { unlink } from 'node:fs'
import NodeID3 from 'node-id3'
import { join } from 'path'

import type { Tags } from '../../../../shared/types'
import { getWin } from '../../index'
import { isFlacFile, isMP3File } from './fn'
import log from './log'

export const downloadFile = (data: { fileName?: string; url: string; completed?: (file: File) => void }) => {
  const win = getWin()
  const downloadLocation = app.getPath('downloads')
  const fileName = data.fileName || data.url.split('/').pop()
  if (win) {
    download(win, data.url, {
      directory: downloadLocation,
      showBadge: false,
      filename: fileName,
      onStarted(item) {
        log.info('download file start', fileName)
        win.webContents.send('startDownload', { name: item.getFilename() })
      },
      onProgress(progress) {
        progress.percent = (progress.transferredBytes / progress.totalBytes) * 100
        win.webContents.send('downloadProgress', progress)
        log.info('download file progress', progress)
      },
      onCompleted(file) {
        win.webContents.send('downloadCompleted', file, fileName)
        log.info('download file completed', file)
        if (data.completed) {
          data.completed(file)
        }
      },
    })
  } else {
    log.warn('not found window')
  }
}

export const downloadTrack = async (data: { fileName?: string; url: string; tags: Tags }) => {
  const { fileName, url, tags } = data
  const { cover } = tags
  tags.APIC = await getSongArtworkPath(cover)
  downloadFile({
    fileName,
    url,
    completed: (file) => {
      const { path } = file
      if (isMP3File(path)) {
        updateId3Tags(tags, path)
      }
      if (isFlacFile(path)) {
        updateVorbis(tags, path)
      }
    },
  })
}

async function getSongArtworkPath(url) {
  const win = getWin()
  const tempDirectory = join(app.getPath('userData'), 'temp')
  if (win) {
    const downloadItem = await download(win, url, {
      directory: tempDirectory,
      showBadge: false,
    })
    const coverPath = downloadItem.getSavePath()
    log.info('download artwork temp file', coverPath)
    return coverPath
  }
}

/**
 * update mp3 file metadata
 * @param tags
 * @param path
 */
async function updateId3Tags(tags: Tags, path: string) {
  NodeID3.write(tags, path)
  // remove temp artwork file
  unlink(tags.APIC, () => {
    log.info('remove artwork temp file', tags.APIC)
  })
}

/**
 * update flac lossless file metadata
 */
async function updateVorbis(tags: Tags, path: string) {
  // todo
  // const py = join(__dirname, '../../dist', 'flac.py')
  // const output = await runPythonScript(py, [path])
}

function runPythonScript(scriptPath, args) {
  return new Promise((resolve, reject) => {
    const python = spawn('python', [scriptPath, ...args])

    let output = ''

    python.stdout.on('data', (data) => {
      output += data.toString()
    })
    python.stderr.on('data', (data) => {
      console.error(data.toString())
    })
    python.on('close', (code) => {
      if (code === 0) {
        resolve(output)
      } else {
        reject(new Error(`Python script exited with code ${code}`))
      }
    })
    python.on('error', reject)
  })
}
