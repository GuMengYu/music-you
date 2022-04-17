
import { Howl } from 'howler';

export class Player {
    howler: null | Howl;
    track: {} | null;
    volume: number;
    currentTime: number;
    playing: boolean;
    playingList: {};
    isFM: boolean;
    stageMusicURL: string | null;
    constructor(options: {}) {
      this.howler = null;
      this.track = null;
      this.volume = 0.6;
      this.currentTime = 0;
      this.playing = false;
      this.playingList = {};
      this.isFM = false;
      this.stageMusicURL = null;
      this.init();
    }
    init() {
      console.log('player init success');
    }
}

