import install from './install';

import { Howl, Howler } from 'howler';
import { throttle, shuffle } from 'lodash-es';
import { scrobble } from '@/api/music';

export default class Player {
  constructor(store) {
    this.store = store;
    this.howler = null;
    this.track = null;
    this.volume = 0.6;
    this.currentTime = 0;
    this.playing = false;
    this.playingList = [];
    this.isFM = false;

    this._updateCurrentTime = throttle(this.updateCurrentTime, 1000);
    this.init();
  }
  init() {
    this.initStoreEvent();
    this.restoreStateFromStore();
    if (this.track?.id && this.track?.url) {
      this.updatePlayerTrack(this.track.id, false, false);
    }
  }
  shuffle() {
    const list = shuffle(this.playingList);
    this.store.dispatch('music/updatePlayingList', {
      list,
    });
  }
  async updatePlayList(list) {
    const _list = await this.store.dispatch('music/updatePlayingList', list);
    this.playingList = _list;
    return _list?.[0];
  }
  initStoreEvent() {
    this.store.subscribe((mutation) => {
      if (mutation.type.startsWith('music/playing')) {
        if (mutation.payload) {
          this._play();
        } else {
          this._pause();
        }
      }
      if (mutation.type.startsWith('music/isCurrentFm')) {
        this.isFM = mutation.payload;
      }
      if (mutation.type.startsWith('settings/volume')) {
        Howler.volume(mutation.payload);
      }
    });
  }
  restoreStateFromStore() {
    const volume = this.store.state?.settings?.volume ?? 0.5;
    const state = this.store?.state?.music;

    Object.keys(this).forEach((key) => {
      if (state[key] !== void 0) {
        this[key] = state[key];
      }
    });
    this.volume = volume;
  }
  async updatePlayerTrack(id, autoplay = true, resetProgress = true) {
    const track = await this.store.dispatch('music/updateTrack', { id });
    this.track = track;
    Howler.unload();
    this.howler = null;
    this.howler = this.initSound(track.url);
    if (resetProgress) {
      this.setSeek(0);
    }
    if (autoplay) {
      this.play();
    }
    this.initMediaSession();
  }
  initSound(src) {
    Howler.autoUnlock = false;
    Howler.usingWebAudio = true;
    Howler.volume(this.volume);
    const sound = new Howl({
      src: [src],
      html5: true,
      preload: 'metadata',
      format: ['mp3', 'flac'],
      onplay: () => {
        requestAnimationFrame(this.step.bind(this));
        // this.saveToRecent();
      },
      // onend: function() {
      //   // Stop the wave animation.
      // },
      // onpause: function() {
      //   // Stop the wave animation.
      // },
      // onstop: function() {
      //   // Stop the wave animation.
      // },
      onplayerror: (id, e) => {
        console.log(id, e);
      },
      onseek: () => {
        // Start updating the progress of the track.
        requestAnimationFrame(this.step.bind(this));
      },
      onload: () => {
        this.trackLoaded();
      },
      onloaderror: () => {
        console.log('歌曲加载失败');
        this.trackLoaded();
        // this.store.dispatch(
        //   'snackbar/show',
        //   { text: '歌曲暂时不可用', type: 'warning' },
        // );
      },
    });
    sound.once('end', this.endCb.bind(this));
    sound.seek(this.currentTime);
    return sound;
  }
  trackLoaded() {
    console.log('loaded', this);
    this.store.commit('music/loadingTrack', false);
  }
  _pause() {
    this.howler?.pause();
    this.playing = false;
  }
  _play() {
    this.howler?.play();
    this.playing = true;
  }
  play() {
    this.store.commit('music/playing', true);
  }
  pause() {
    this.store.commit('music/playing', false);
  }
  togglePlay() {
    this.store.commit('music/playing', !this.playing);
  }
  next() {
    this.updatePlayerTrack(this.nextTrackId());
  }
  prev() {
    this.updatePlayerTrack(this.prevTrackId());
  }
  nextTrackId() {
    if (this.isFM) {
      return this.store.getters['music/nextFmTrackId'];
    } else {
      return this.store.getters['music/nextTrackId'];
    }
  }
  prevTrackId() {
    return this.store.getters['music/prevTrackId'];
  }
  updateCurrentTime() {
    const current = Math.ceil(this.howler.seek());
    this.currentTime = current;
    this.store.commit('music/currentTime', current);
    localStorage.setItem('currentTime', this.currentTime);
  }
  setSeek(val) {
    this.howler.seek(val);
    this._updateCurrentTime();
  }
  step() {
    if (this.howler.playing()) {
      this._updateCurrentTime();
      requestAnimationFrame(this.step.bind(this));
    }
  }
  endCb() {
    // todo update 听歌记录
    this.next();
  }
  setScrobble(track, time, played = false) {
    console.log(this.track);
    const { id, dt } = track;
    const sourceid = this.playingList.id;
    if (played) {
      time = +dt / 1000;
    }
    scrobble({
      id,
      sourceid,
      time,
    });
  }
  initMediaSession() {
    // https://developers.google.com/web/updates/2017/02/media-session
    if ('mediaSession' in navigator) {
      /* global MediaMetadata */
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.track.name,
        artist: this.track.ar?.[0]?.name,
        album: this.track.al?.name,
        artwork: [
          {
            src: this.track?.al?.picUrl ?? '',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });
      [
        ['play', this.playPause],
        ['pause', this.playPause],
        ['previoustrack', this.playPrev],
        ['nexttrack', this.playNext],
      ].map(([name, fn]) => navigator.mediaSession.setActionHandler(name, fn));
    }
  }
  saveToRecent() {
    this.store.dispatch('music/pushRecent', this.track.id);
  }
}

Player.install = install;
