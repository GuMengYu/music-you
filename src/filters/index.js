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
export function formatDuring(val) {
  if(val) {
    let min = Math.floor(val/1000/60);
    let sec = Math.floor(val % (1000 * 60) / 1000);
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  } else {
    return '00:00';
  }
}

export default {
  empty,
  formatDuring,
  sizeOfImage,
};
