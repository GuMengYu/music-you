import install from './install';

import { Howl, Howler } from 'howler';
import { isArray, shuffle, throttle } from 'lodash-es';
import { scrobble } from '@/api/music';

export default class Player {
  constructor(store) {
    this.store = store;
    this.howler = null;
    this.track = null;
    this.volume = 0.6;
    this.currentTime = 0;
    this.playing = false;
    this.playingList = {};
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
    const list = shuffle(this.playingList?.list);
    this.store.dispatch('music/updatePlayingList', {
      list,
    });
  }
  async updatePlayList(data) {
    let list, id;
    console.log(data);
    const isAlbum = !!data.album;
    if (isArray(data)) {
      list = data;
    } else if (isAlbum) {
      list = data.songs;
      id = data.album?.id;
    } else {
      list = data.tracks;
      id = data.id;
    }
    const { list: _list } = await this.store.dispatch(
      'music/updatePlayingList',
      { list, id },
    );
    this.playingList.list = _list;
    this.playingList.id = id;
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
    this.store.commit('music/loadingTrack', true);
    if (resetProgress) {
      this.updateCurrentTime(0);
    }
    const track = await this.store.dispatch('music/getTrack', id);
    if (track) {
      this.track = track;
      Howler.unload();
      this.howler = null;
      this.howler = this.initSound(track.url);
      this.initMediaSession(track);
      if (resetProgress) {
        this.setSeek(0);
      } else {
        this.setSeek(this.currentTime);
      }
      if (autoplay) {
        this.play();
        this.setScrobble(this.track, this.howler.seek(), false);
      }
    }
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
        const { name, ar = [] } = this.track;
        const artists = ar.map((a) => a.name).join('&');
        document.title = `💿 ${name} - ${artists}`;
      },
      onloaderror: (e) => {
        console.log(e);
        this.trackLoaded();
        window?.app?.$toast.error('歌曲加载失败');
      },
    });
    sound.once('end', this.endCb.bind(this));
    sound.seek(0);
    return sound;
  }
  trackLoaded() {
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
  updateCurrentTime(val) {
    const current = val ?? Math.ceil(this.howler.seek());
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
    this.setScrobble(this.track, 0, true);
  }
  setScrobble(track, time, played = false) {
    const { id, dt } = track;
    const sourceid = this.playingList.id;
    if (played) {
      time = +dt / 1000;
    }
    if (time) {
      console.log('歌曲打卡', this.track.name, time, played);
      scrobble({
        id,
        sourceid,
        time,
      });
    }
  }
  initMediaSession(track) {
    // https://developers.google.com/web/updates/2017/02/media-session
    if ('mediaSession' in navigator) {
      const { ar: artist = [], al: album = {}, name: title } = track;
      /* global MediaMetadata */
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: artist.map((a) => a.name).join('&'),
        album: album.name,
        artwork: [
          {
            src: album.picUrl ?? '',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      });
      [
        ['play', this.togglePlay],
        ['pause', this.togglePlay],
        ['previoustrack', this.prev],
        ['nexttrack', this.next],
      ].map(([name, fn]) =>
        navigator.mediaSession.setActionHandler(name, fn.bind(this)),
      );
    }
  }
  saveToRecent() {
    this.store.dispatch('music/pushRecent', this.track.id);
  }
}

Player.install = install;
