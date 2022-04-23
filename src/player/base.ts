import { Howl, Howler } from 'howler'
import type { DebouncedFunc } from 'lodash-es'
import { isArray, shuffle, throttle } from 'lodash-es'
import type { Store } from 'pinia'

import { getTrackDetail, scrobble } from '@/api/music'
import { useAppStore } from '@/store/app'
import type { PlayerState } from '@/store/player'
import { usePlayerStore } from '@/store/player'
import type { TrackSource } from '@/types'

export class Player {
  howler: null | Howl
  track: null | TrackSource
  volume: number
  currentTime: number
  playing: boolean
  playingList: {
    id?: string | number
    list: TrackSource[]
  }
  isCurrentFm: boolean
  stageMusicURL: string | null
  appStore: Store
  store: Store
  _updateCurrentTime: DebouncedFunc<(currentTime?: number) => void>
  constructor() {
    this.appStore = useAppStore()
    this.store = usePlayerStore()
    this.howler = null

    const { track, playing, volume = 0.8, currentTime, playingList, isCurrentFm } = this.store.$state as PlayerState
    this.track = track
    this.volume = volume
    this.currentTime = currentTime
    this.playing = playing
    this.playingList = playingList
    this.isCurrentFm = isCurrentFm
    this.stageMusicURL = null
    this._updateCurrentTime = throttle(this.updateCurrentTime, 1000)

    this.init()
  }
  async init() {
    this.initStoreEvent()
    if (this.track?.id) {
      console.log('restore track from storage', this.track)
      await this.updatePlayerTrack(this.track.id, false, false)
    }
  }
  shuffle() {
    const list = shuffle(this.playingList?.list)
    // this.store.$patch('music/updatePlayingList', {
    //     list,
    // });
  }
  async updatePlayList(data: {
    id?: string | number
    list: TrackSource[]
    album?: { id: string | number }
    tracks?: TrackSource[]
    songs?: TrackSource[]
  }) {
    let list, id
    const isAlbum = !!data.album
    if (isArray(data)) {
      list = data
    } else if (isAlbum) {
      list = data.songs
      id = data.album?.id
    } else {
      list = data.tracks
      id = data.id
    }
    this.store.$patch({
      playingList: {
        list,
        id,
      },
    })
    this.playingList.list = list as TrackSource[]
    this.playingList.id = id
    return list?.[0]
  }
  initStoreEvent() {
    this.store.$subscribe((mutation, state) => {
      const { type, events } = mutation
      const { playing, volume, playingList, isCurrentFm } = state as PlayerState
      if (type === 'direct') {
        if (events.key === 'playing') {
          if (playing) {
            this.play()
          } else {
            this.pause()
          }
        }
        if (events.key === 'volume') {
          this.volume = volume
        }
        if (events.key === 'playingList') {
          this.updatePlayList(playingList)
        }
        if (events.key === 'isCurrentFm') {
          this.isCurrentFm = isCurrentFm
        }
      }
    })
  }
  async getTrack(id: string | number) {
    try {
      const track = await getTrackDetail(id, this.appStore.logged)
      if (track.url) {
        return {
          track,
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  async updatePlayerTrack(id: string | number, autoplay = true, resetProgress = true) {
    if (!id) return
    const { isCurrentFm } = this.store.$state as PlayerState
    this.store.$state.loadingTrack = true
    const { track: trackInfo } = await this.getTrack(id)
    if (trackInfo.url) {
      this.store.$state.track = trackInfo
      if (isCurrentFm) {
        this.store.$state.fmTrack = trackInfo
      }
      if (resetProgress) {
        this.updateCurrentTime(0)
      }
      this.track = trackInfo
      Howler.unload()
      this.howler = null
      this.howler = this.initSound(trackInfo.url)
      this.initMediaSession(trackInfo)
      if (resetProgress) {
        this.setSeek(0)
      } else {
        this.setSeek(this.currentTime)
      }
      if (autoplay) {
        this.play()
        this.setScrobble(trackInfo, this.howler.seek(), false)
      }
      // if (from === 'online' && cacheLimit) {
      //     // 延迟请求buffer缓存 防止阻塞后面播放的url请求
      //     await sleep(500);
      //     playerIDB.cacheTrack(trackInfo, cacheLimit);
      // }
    } else {
      // window?.app?.$toast.warning(`${trackInfo.name} 暂不可用, 自动播放下一曲`);
      // await sleep(1000);
      // this.next();
    }
  }
  initSound(src: string) {
    Howler.autoUnlock = false
    Howler.usingWebAudio = true
    Howler.volume(this.volume)
    const sound = new Howl({
      src: [src],
      html5: true,
      preload: 'metadata',
      format: ['mp3', 'flac'],
      onplay: () => {
        requestAnimationFrame(this.step.bind(this))
      },
      onplayerror: (id, e) => {
        console.log(id, e)
      },
      onseek: () => {
        // Start updating the progress of the track.
        requestAnimationFrame(this.step.bind(this))
      },
      onload: () => {
        this.trackLoaded()
        const { name, ar = [] } = this.track
        const artists = ar.map((a) => a.name).join('&')
        document.title = `💿 ${name} - ${artists}`
        this.fixDuration()
      },
      onloaderror: (e) => {
        console.log(e)
        this.trackLoaded()
        // window?.app?.$toast.error('歌曲加载失败');
      },
    })
    sound.once('end', this.endCb.bind(this))
    sound.seek(0)
    return sound
  }
  // 修正歌曲时长，当实际获取的音源时长，与网易返回的音源时长相差超过1s, 则修正为实际的音源时长
  fixDuration() {
    const duration = this.howler?.duration() ?? 0
    const factDuration = duration * 1000
    const trackDuration = this.track?.dt ?? 0
    const offset = factDuration - trackDuration
    if (offset > 1000 || offset < -1000) {
      console.log(
        `net ease返回的歌曲长度: ${this.track?.dt}， 歌曲实际长度: ${duration * 1000}， 偏差大小: ${offset}，修正`
      )
      this.store.$state.track.dt = factDuration
      // this.store.commit('music/updateDuration', factDuration);
    }
  }
  trackLoaded() {
    this.store.$state.loadingTrack = false
  }
  pause() {
    this.howler?.pause()
    this.playing = false
    this.store.$state.playing = false
  }
  play() {
    this.howler?.play()
    this.playing = true
    this.store.$state.playing = true
  }
  togglePlay() {
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }
  next() {
    if (this.nextTrackId()) {
      this.updatePlayerTrack(this.nextTrackId())
    } else {
      this.pause()
    }
  }
  prev() {
    this.updatePlayerTrack(this.prevTrackId())
  }
  nextTrackId() {
    if (this.isCurrentFm) {
      return this.store.nextFmTrackId
    } else {
      return this.store.nextTrackId
    }
  }
  prevTrackId() {
    return this.store.prevTrackId
  }
  updateCurrentTime(this: Player, val: number) {
    const current = val ?? Math.ceil(this.howler?.seek())
    this.currentTime = current
    this.store.$state.currentTime = current
  }
  setSeek(val: number) {
    this.howler?.seek(val)
    this._updateCurrentTime(val)
  }
  step() {
    if (this.howler?.playing()) {
      this._updateCurrentTime()
      requestAnimationFrame(this.step.bind(this))
    }
  }
  endCb() {
    // todo update 听歌记录
    this.next()
    this.setScrobble(this.track, 0, true)
  }
  setScrobble(this: Player, track: TrackSource, time: number, played = false) {
    const { id, dt } = track
    const sourceid = this.playingList.id
    if (played) {
      time = +dt / 1000
    }
    if (time) {
      console.log('歌曲打卡', this.track?.name, Math.ceil(time), played)
      scrobble({
        id,
        sourceid,
        time: Math.ceil(time),
      })
    }
  }
  initMediaSession(track: TrackSource) {
    // https://developers.google.com/web/updates/2017/02/media-session
    if ('mediaSession' in navigator) {
      const { ar: artist, al: album, name: title } = track
      /* global MediaMetadata */
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: artist?.map((a) => a.name).join('&'),
        album: album.name,
        artwork: [
          {
            src: album?.picUrl ?? '',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      })
      ;[
        ['play', this.togglePlay],
        ['pause', this.togglePlay],
        ['previoustrack', this.prev],
        ['nexttrack', this.next],
      ].map((ac) => {
        const [action, handler] = ac
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler.bind(this))
      })
    }
  }
}
