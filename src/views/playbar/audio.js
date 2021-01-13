import {Message} from '@/plugins/snackbar';
export default class Audio {
  constructor(element) {
    this.element = element;
  }
  play() {
    if (this.element.readyState === 4) {
      this.element.play();
    } else {
      Message.warning('歌曲未准备好，无法播放');
    }
  }
  pause() {
    this.element.pause();
  }
}
