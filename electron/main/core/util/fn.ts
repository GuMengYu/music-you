import { exec } from 'node:child_process'
import { extname } from 'path'
/**
 * 判断文件是否为 MP3 文件
 * @param {string} filePath - 文件路径
 * @returns {boolean} 是否为 MP3 文件
 */
export function isMP3File(filePath) {
  const extName = extname(filePath)
  return extName === '.mp3' || extName === '.m4a'
}

export function isFlacFile(filePath) {
  const extName = extname(filePath)
  return extName === '.flac'
}

/**
 * 检查 Python 是否已安装
 * @returns {Promise<boolean>} - Promise 对象，表示 Python 是否已安装
 */
function isPythonInstalled() {
  const command = 'python --version'

  return new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
