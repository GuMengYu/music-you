export default {
  empty(val) {
    return !val || '空';
  },
  formatDuring(val) {
    if(val) {
      let min = Math.floor(val/1000/60);
      let sec = Math.floor(val % (1000 * 60) / 1000);
      return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
    } else {
      return '00:00';
    }
  },
  sizeOfImage(url, size = 512) {
    if (url) {
      return `${url}?param=${size}y${size}`;
    } else {
      return '';
    }
  },
};
