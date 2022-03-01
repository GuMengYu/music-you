import { inRange } from 'lodash-es';

const reducer = (object, property) => {
  return object?.[property] ?? undefined;
};
export const optional_chain = (...parameters) => {
  const [source, ...properties] = parameters;
  return properties.reduce(reducer, source);
};
/**
 * 休眠
 * @param time
 * @returns {Promise<unknown>}
 */
export const sleep = (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};
export const formatLyric = (lyric = '') => {
  return lyric
    .split('\n')
    .filter((i) => !!i)
    ?.map((i) => {
      const reg = new RegExp(/\[\d*:\d*((\.|:)\d*)*\]/, 'g');
      let [time] = i.match(reg) || [];
      let sentence = i.match(/](.*)/)[1];
      // [by: ***]
      // [00:27.54]The many miles we walked
      // [00:56.33]
      // [00:59.54] That's the way it is
      // [00:12]
      if (time) {
        const min = Number(time.match(/\[(\d*)/i)[1]);
        const sec = Number(time.match(/:(\d*)/i)[1]);
        const mill = time.match(/\.(\d*)]/i)?.[1];
        const millToSec = +(Number(mill ?? 0) / 1000).toFixed(2);
        time = min * 60 + sec + millToSec;
        sentence = sentence || '...';
      } else {
        sentence = sentence || i;
      }
      return {
        time,
        sentence,
      };
    });
};

export const redirect = (url, target = '_blank') => {
  window.open(url, target);
};

/**
 * 下载文件
 * 参考 https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
 * @param url
 * @param name
 */
export const downloadFile = (url, name) => {
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = url;
  tempLink.download = name;
  tempLink.setAttribute('download', 'download');

  tempLink.setAttribute('target', '_blank');

  document.body.appendChild(tempLink);

  tempLink.click();

  // Fixes "webkit blob resource error 1"
  setTimeout(function () {
    document.body.removeChild(tempLink);
  }, 200);
};
export const isElectron = () => {
  return process.env.IS_ELECTRON;
};

export function fileToBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target.result;
      resolve(data);
    };
    try {
      reader.readAsArrayBuffer(file);
    } catch (e) {
      reject(e);
    }
  });
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    try {
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}
export function imageToDataUrl(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, image.width, image.height);
  return canvas.toDataURL('image/png');
}

export function getImageDataUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = () => {
      try {
        resolve(imageToDataUrl(image));
      } catch (e) {
        reject(e);
      }
    };
    image.onerror = reject;
    image.src = url;
  });
}

/**
 * 容量单位转换
 * @param {*} bytes
 * @param {*} k
 * @returns
 */
export function bytesToSize(_bytes, k = 1024) {
  const bytes = +_bytes;
  if (bytes === 0) return '0 B';
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

export function sizeOfImage(url, size = 512) {
  if (url) {
    return `${url}?param=${size}y${size}`;
  } else {
    return '';
  }
}
export function empty(val) {
  return !val || '空';
}
export function formatDuring(t, i18n = false) {
  const HOUR = 1000 * 60 * 60;
  const d = parseInt(t / (HOUR * 24));
  const h = parseInt((t % (HOUR * 24)) / HOUR);
  const m = parseInt((t % HOUR) / (1000 * 60));
  const s = parseInt((t % (1000 * 60)) / 1000);

  if (i18n) {
    let text = '';
    d && (text += `${d}${i18n ?? 'd'}`);
    h && (text += `${h}${i18n ?? 'h'}`);
    m && (text += `${m}${i18n ?? 'm'}`);
    s && (text += `${s}${i18n ?? 's'}`);
    return text || '-';
  } else {
    return `${h > 0 ? `${h < 10 ? `0${h}` : h}:` : ''}${m < 10 ? `0${m}` : m}:${
      s < 10 ? `0${s}` : s
    }`;
  }
}
export const formatNumber = (number) => {
  if (inRange(number, 1000, 1000000)) {
    return `${(number / 1000).toFixed(2)} K`;
  } else if (inRange(number, 1000001, 1000000000)) {
    return `${(number / 1000000).toFixed(2)} M`;
  } else if (inRange(number, 1000000001, Infinity)) {
    return `${(number / 1000000000).toFixed(2)} B`;
  } else {
    return number;
  }
};
