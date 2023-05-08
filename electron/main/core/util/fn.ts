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
