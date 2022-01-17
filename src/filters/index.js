import { inRange } from 'lodash-es';
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
    return `${~~(number / 1000)}K`;
  } else if (inRange(number, 1000001, 1000000000)) {
    return `${~~(number / 1000000)}M`;
  } else {
    return number;
  }
};

export default {
  empty,
  formatDuring,
  sizeOfImage,
  formatNumber,
};
