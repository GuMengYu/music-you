import { inRange } from 'lodash-es'

/**
 * 休眠
 * @param time
 * @returns {Promise<unknown>}
 */
export const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time)
    }, time)
  })
}
/**
 * 格式化网易云歌词
 * @param lyric
 */
export const formatLyric = (lyric = '') => {
  return lyric
    .split('\n')
    .filter((i) => !!i)
    ?.map((i) => {
      const reg = new RegExp(/\[\d*:\d*((\.|:)\d*)*\]/, 'g')
      const timeStr = i.match(reg)?.[0] ?? ''
      let time = 0
      let sentence = i.match(/](.*)/)?.[1]
      // [by: ***]
      // [00:27.54]The many miles we walked
      // [00:56.33]
      // [00:59.54] That's the way it is
      // [00:12]
      if (timeStr) {
        const min = Number(timeStr.match(/\[(\d*)/i)?.[1])
        const sec = Number(timeStr.match(/:(\d*)/i)?.[1])
        const mill = timeStr.match(/\.(\d*)]/i)?.[1]
        const millToSec = +(Number(mill ?? 0) / 1000).toFixed(2)
        time = min * 60 + sec + millToSec
        sentence = sentence || '...'
      } else {
        sentence = sentence || i
      }
      return {
        time,
        sentence,
      }
    })
}

/**
 * 下载文件
 * 参考 https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param url
 * @param name
 */
export const downloadFile = (url: string, name: string) => {
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = url
  tempLink.download = name
  tempLink.setAttribute('download', 'download')

  tempLink.setAttribute('target', '_blank')

  document.body.appendChild(tempLink)

  tempLink.click()

  // Fixes "webkit blob resource error 1"
  setTimeout(function () {
    document.body.removeChild(tempLink)
  }, 200)
}

/**
 * file对象转二进制流
 * @param file
 */
export function fileToBuffer(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result)
    }
    try {
      reader.readAsArrayBuffer(file)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * file对象转DataURL
 * @param file
 */
export function fileToDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result)
    }
    try {
      reader.readAsDataURL(file)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * 图片转DataURL
 * @param image
 */
export function imageToDataUrl(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(image, 0, 0, image.width, image.height)
  return canvas.toDataURL('image/png')
}

/**
 * 从远程获取图片，并转换成DataURL
 * @param url
 */
export function getImageDataUrl(url: string) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.setAttribute('crossOrigin', 'Anonymous')
    image.onload = () => {
      try {
        resolve(imageToDataUrl(image))
      } catch (e) {
        reject(e)
      }
    }
    image.onerror = reject
    image.src = url
  })
}

/**
 * 容量单位转换
 * @param _bytes 大小（字节）
 * @param {*} k 标准大小 （1024 ｜ 1000）
 * @returns
 */
export function bytesToSize(_bytes: string | number, k = 1024) {
  const bytes = +_bytes
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

/**
 * 图片路径追加size参数
 * @param url
 * @param size
 */
export function sizeOfImage(url: string, size = 512) {
  return url ? `${url}?param=${size}y${size}` : ''
}

/**
 * 格式化时间
 * @param t
 * @param i18n
 */
export function formatDuring(t: number, i18n = false) {
  const HOUR = 1000 * 60 * 60
  const d = Math.floor(t / (HOUR * 24))
  const h = Math.floor((t % (HOUR * 24)) / HOUR)
  const m = Math.floor((t % HOUR) / (1000 * 60))
  const s = Math.floor((t % (1000 * 60)) / 1000)

  if (i18n) {
    let text = ''
    d && (text += `${d}${i18n ?? 'd'}`)
    h && (text += `${h}${i18n ?? 'h'}`)
    m && (text += `${m}${i18n ?? 'm'}`)
    s && (text += `${s}${i18n ?? 's'}`)
    return text || '-'
  } else {
    return `${h > 0 ? `${h < 10 ? `0${h}` : h}:` : ''}${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }
}

/**
 * 格式化数字
 * @param number
 */
export const formatNumber = (number: number) => {
  if (inRange(number, 1000, 1000000)) {
    return `${(number / 1000).toFixed(2)} K`
  } else if (inRange(number, 1000001, 1000000000)) {
    return `${(number / 1000000).toFixed(2)} M`
  } else if (inRange(number, 1000000001, Infinity)) {
    return `${(number / 1000000000).toFixed(2)} B`
  } else {
    return number
  }
}
