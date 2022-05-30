import { Howl, Howler } from 'howler'
import type { DebouncedFunc } from 'lodash-es'
import { shuffle, throttle } from 'lodash-es'
import type { Store } from 'pinia'
import { useToast } from 'vue-toastification'

import { sleep } from '@/util/fn'

import { getTrackDetail, scrobble } from '../api/music'
import type { PlayerState } from '../store/player'
import { usePlayerStore } from '../store/player'
import type { Track, Tracks } from '../types'
const toast = useToast()

export interface PlayerInstance {
  updateTracks: (tracks: Tracks | Track[], autoPlay?: boolean) => void
  updatePlayerTrack: (trackId: Track['id'], autoPlay?: boolean, resetProgress?: boolean) => void
  pause: () => void
  play: () => void
  next: () => void
  prev: () => void
  togglePlay: () => void
  setSeek: (seek: number) => void
  // isDisabled: boolean
  // themes: Ref<Record<string, InternalThemeDefinition>>
  // current: Ref<string>
  // themeClasses: Ref<string | undefined>
  // setTheme: (key: string, theme: InternalThemeDefinition) => void
  // getTheme: (key: string) => InternalThemeDefinition
  // styles: Ref<string>
}
export class Player {
  howler: null | Howl
  track: null | Track
  volume: number
  currentTime: number
  playing: boolean
  playingList: {
    id?: string | number
    list: Track[]
  }
  _progressInterval: ReturnType<typeof setInterval> | undefined
  isCurrentFm: boolean
  stageMusicURL: string | null
  store: Store<'player', PlayerState>
  _updateCurrentTime: DebouncedFunc<(currentTime?: number) => void>
  constructor() {
    this.store = usePlayerStore()
    this.howler = null

    const { track, playing, volume = 0.8, currentTime, playingList, isCurrentFm } = this.store
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
  private async init() {
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
  async updateTracks(
    tracks: {
      id?: string | number
      list: Track[]
    },
    autoPlay = true
  ) {
    // update store
    this.store.$patch({ playingList: tracks })
    this.playingList = tracks
    if (autoPlay) {
      await this.updatePlayerTrack(tracks.list[0]?.id, true)
    }
    return tracks
  }
  private initStoreEvent() {
    this.store.$subscribe((mutation, state) => {
      const { type } = mutation
      const { playing, volume, isCurrentFm } = state as PlayerState
      if (type === 'direct') {
        if (this.playing !== playing) {
          if (playing) {
            this.play()
          } else {
            this.pause()
          }
        }
        if (this.volume !== volume) {
          this.volume = volume
          Howler.volume(volume)
        }
        if (this.isCurrentFm !== isCurrentFm) {
          this.isCurrentFm = isCurrentFm
        }
      }
    })
  }
  async updatePlayerTrack(trackId: string | number, autoplay = true, resetProgress = true) {
    if (!trackId) return
    const { isCurrentFm } = this.store.$state as PlayerState
    this.store.$state.loadingTrack = true
    const trackInfo = await getTrackDetail(trackId)
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
        // this.setScrobble(trackInfo, this.howler.seek(), false)
      }
      // if (from === 'online' && cacheLimit) {
      //     // 延迟请求buffer缓存 防止阻塞后面播放的url请求
      //     await sleep(500);
      //     playerIDB.cacheTrack(trackInfo, cacheLimit);
      // }
    } else {
      toast.warning(`${trackInfo.name} 暂不可用, 将自动播放下一曲`)
      await sleep(500)
      this.next()
    }
  }
  private initSound(src: string) {
    Howler.autoUnlock = false
    Howler.usingWebAudio = true
    Howler.volume(this.volume)
    const sound = new Howl({
      src: [src],
      html5: true,
      preload: 'metadata',
      format: ['mp3', 'flac'],
      onplay: () => {
        this.setProgressInterval()
      },
      onplayerror: (id, e) => {
        console.log(id, e)
      },
      onseek: () => {
        // do noting
      },
      onload: () => {
        this.trackLoaded()
        if (this.track) {
          const { name, ar = [] } = this.track
          const artists = ar.map((a) => a.name).join('&')
          document.title = `${name} - ${artists}`
          this.fixDuration()
        }
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
  private fixDuration() {
    const duration = this.howler?.duration() ?? 0
    const factDuration = duration * 1000
    const trackDuration = this.track?.dt ?? 0
    const offset = factDuration - trackDuration
    if (offset > 1000 || offset < -1000) {
      console.log(
        `net ease返回的歌曲长度: ${this.track?.dt}， 歌曲实际长度: ${duration * 1000}， 偏差大小: ${offset}，修正`
      )
      if (this.store.$state.track) {
        this.store.$state.track.dt = factDuration
      }
    }
  }
  private trackLoaded() {
    this.store.$state.loadingTrack = false
  }
  pause() {
    this.howler?.pause()
    this.playing = false
    this.store.playing = false
  }
  play() {
    this.howler?.play()
    this.playing = true
    this.store.playing = true
  }
  togglePlay() {
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }
  next() {
    const trackId = this.nextTrackId()
    if (typeof trackId === 'string' || typeof trackId === 'number') {
      this.updatePlayerTrack(trackId)
    } else {
      this.pause()
    }
  }
  prev() {
    const trackId = this.prevTrackId()
    if (typeof trackId === 'string' || typeof trackId === 'number') {
      this.updatePlayerTrack(trackId)
    } else {
      this.pause()
    }
  }
  private nextTrackId() {
    if (this.isCurrentFm) {
      return this.store.nextFmTrackId
    } else {
      return this.store.nextTrackId
    }
  }
  private prevTrackId() {
    return this.store.prevTrackId
  }
  updateCurrentTime(this: Player, val: number) {
    const current = val ?? Math.ceil(this.howler?.seek() ?? 0)
    this.currentTime = current
    this.store.currentTime = current
  }
  setSeek(val: number) {
    this.howler?.seek(val)
    // this._updateCurrentTime(val)
  }
  // private step() {
  //   if (this.howler?.playing()) {
  //     if (!this.pauseProgress) {
  //       this._updateCurrentTime()
  //     }
  //     requestAnimationFrame(this.step.bind(this))
  //   }
  // }
  pauseProgress() {
    clearInterval(this._progressInterval)
  }
  restoreProgress() {
    this.setProgressInterval()
  }
  private setProgressInterval(this: Player) {
    this._progressInterval = setInterval(() => {
      if (this.howler?.playing()) {
        const current = Math.ceil(this.howler?.seek() ?? 0)
        this.currentTime = current
        this.store.currentTime = current
      }
    }, 1000)
  }
  private endCb() {
    this.next()
    // todo update 听歌记录
    // this.setScrobble(this.track, 0, true)
  }
  // 接口无效 暂时不用
  // private setScrobble(this: Player, track: Track, time: number, played = false) {
  //   const { id, dt } = track
  //   const sourceid = this.playingList.id
  //   if (played) {
  //     time = +dt / 1000
  //   }
  //   if (time) {
  //     console.log('歌曲打卡', this.track?.name, Math.ceil(time), played)
  //     scrobble({
  //       id,
  //       sourceid,
  //       time: Math.ceil(time),
  //     })
  //   }
  // }
  private initMediaSession(track: Track) {
    // https://developers.google.com/web/updates/2017/02/media-session
    if ('mediaSession' in navigator) {
      const { ar: artist, al: album, name: title } = track
      /* global MediaMetadata */
      navigator.mediaSession.metadata = new MediaMetadata({
        title,
        artist: artist?.map((a) => a.name).join('&'),
        album: album?.name ?? '',
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
        const [action, handler] = ac as ['string', () => void]
        navigator.mediaSession.setActionHandler(action as MediaSessionAction, handler.bind(this))
      })
    }
  }
}
