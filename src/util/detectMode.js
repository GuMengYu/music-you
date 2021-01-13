
class ModeDetect {
  mediaList = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  constructor() {}
  currentMode() {
    return this.mediaList.matches ? 'night' : 'light';
  }
  onChange(cb) {
    this.mediaList.addEventListener('change', cb.bind(this));
  }
}

export default ModeDetect;
