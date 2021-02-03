
class ModeDetect {
  mediaList = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  constructor() {}
  currentMode() {
    return this.mediaList.matches ? 'dark' : 'light';
  }
  isDark() {
    return this.mediaList.matches;
  }
  onChange(cb) {
    this.mediaList.addEventListener('change', cb.bind(this));
  }
}

export default ModeDetect;
