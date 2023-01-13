// import { useIpcRenderer } from '@vueuse/electron'
import { Howl, Howler } from 'howler'
import type { Store } from 'pinia'
import { createI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { end, getTrackDetail, start } from '@/api/music'
import type { PlayerState } from '@/store/player'
import { PLAY_MODE, usePlayerStore } from '@/store/player'
import type { SettingState } from '@/store/setting'
import { useSettingStore } from '@/store/setting'
import type { Track } from '@/types'
import { sleep, toHttps } from '@/util/fn'
import is from '@/util/is'
import { PipLyric } from '@/util/pipLyric'
const toast = useToast()

const messages = {
  zhCN: {
    message: {
      can_not_play: '播放失败, 将自动播放下一曲',
      loadFail: '歌曲加载失败，跳过或稍后再试试哦 🥲',
    },
  },
  en: {
    message: {
      can_not_play: 'Can not play, will play next automatically',
      loadFail: 'Load failed, skip or try again later 🥲',
    },
  },
}
export interface PlayerInstance {
  updatePlayerTrack: (trackId: Track['id'], autoPlay?: boolean, resetProgress?: boolean, isFm?: boolean) => void
  pause: () => void
  play: () => void
  next: () => void
  prev: () => void
  togglePlay: () => void
  setSeek: (seek: number) => void
  setoutputDevice: () => void
}
export interface PipLyric {
  enter: () => void
  onLeave: () => void
  onEnter: () => void
  leave: () => void
  setData: (trac: Track, lyric: Track['lyric']) => void
  pause: () => void
  play: () => void
  updateTime: (time: number) => void
}

export class Player {
  howler: null | Howl
  track: null | Track
  volume: number
  private currentTime: number
  playing: boolean
  private progressInterval: ReturnType<typeof setInterval> | undefined
  private isCurrentFm: boolean
  private readonly store: Store<'player', PlayerState>
  private readonly settingStore: Store<'setting', SettingState>
  private i18n: any
  private locale: string
  pipLyric: null | PipLyric
  html5: boolean
  taskbarProgress?: boolean
  ipcRenderer?: any
  constructor() {
    this.store = usePlayerStore()
    this.settingStore = useSettingStore() as Store<'setting', SettingState>
    this.howler = null
    this.pipLyric = null
    this.html5 = !this.settingStore.visualization

    const { track, playing, volume = 0.8, currentTime, isCurrentFm } = this.store
    this.track = track
    this.volume = volume
    this.currentTime = currentTime
    this.playing = playing
    this.isCurrentFm = isCurrentFm
    this.locale = this.settingStore.locale
    this.i18n = createI18n({
      locale: this.locale,
      fallbackLocale: 'en',
      messages,
    })
    this.init()
  }
  private init() {
    this.pipLyric = PipLyric()() as unknown as PipLyric
    this.initStoreEvent()
    if (this.track?.id) {
      this.updatePlayerTrack(this.track.id, false, false)
    }
    // if (is.electron() && is.windows()) {
    //   this.taskbarProgress = true
    //   this.ipcRenderer = useIpcRenderer()
    // }
  }
  private initStoreEvent() {
    this.store.$subscribe((mutation, state) => {
      const { type } = mutation
      const { playing, volume, isCurrentFm } = state
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
          this.howler?.volume(volume)
          // Howler.volume(volume)
        }
        if (this.isCurrentFm !== isCurrentFm) {
          this.isCurrentFm = isCurrentFm
        }
      }
    })
    this.settingStore.$subscribe((mutation, state) => {
      const { locale } = state
      if (mutation.type === 'direct') {
        if (this.locale !== locale) {
          this.locale = locale
          this.i18n.global.locale = locale
        }
      }
    })
  }
  /**
   * 播放指定歌曲
   * @param trackId 歌曲id
   * @param autoplay 立即播放（true）
   * @param resetProgress 重置进度条（true）
   * @returns
   */
  async updatePlayerTrack(trackId: number, autoplay = true, resetProgress = true, isFm = false) {
    if (!trackId) return
    this.store.$state.loadingTrack = true
    const { track, trackMeta, lyric } = await getTrackDetail(trackId)
    // restore common mode
    if (!isFm) {
      this.store.$state.isCurrentFm = false
    }
    if (trackMeta.url) {
      track.lyric = lyric // 存入歌词
      track.meta = trackMeta
      this.store.$state.track = track // 保存到 store
      if (resetProgress) {
        this.updateCurrentTime(0)
      }
      this.track = track
      Howler.unload()
      this.howler?.unload()
      this.howler = null
      this.howler = this.initSound(toHttps(trackMeta.url))
      this.initMediaSession(track)
      if (resetProgress) {
        this.setSeek(0)
      } else {
        this.setSeek(this.currentTime)
      }
      if (autoplay) {
        this.play()
        await start({ id: this.track.id })
        // this.setScrobble(trackInfo, this.howler.seek(), false)
      }
      // if (from === 'online' && cacheLimit) {
      //     // 延迟请求buffer缓存 防止阻塞后面播放的url请求
      //     await sleep(500);
      //     playerIDB.cacheTrack(trackInfo, cacheLimit);
      // }
    } else {
      toast.error(track?.name + this.t('message.can_not_play'))
      await sleep(500)
      this.next()
    }
    this.setoutputDevice()
  }
  private initSound(src: string) {
    Howler.autoUnlock = false
    Howler.usingWebAudio = true
    const sound = new Howl({
      volume: this.volume,
      src,
      html5: this.html5,
      preload: 'metadata',
      format: ['mp3', 'flac'],
      onplay: () => {
        this.pauseProgress()
        this.setProgressInterval()
      },
      onplayerror: () => {
        toast.error(this.track?.name + this.t('message.loadFail'))
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
          this.pipLyric?.setData(this.track, this.track.lyric)
          // this.pipLyric.enter()
        }
      },
      onloaderror: (e) => {
        console.log(e)
        this.trackLoaded()
        toast.error(this.t('message.loadFail'))
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
    this.store.playing = false
    this.howler?.fade(this.volume, 0, 500)
    this.howler?.once('fade', () => {
      this.howler?.pause()
      this.playing = false
      this.pipLyric?.pause()
    })
  }
  play() {
    if (this.howler?.playing()) return
    this.store.playing = true
    this.howler?.play()
    this.howler?.once('play', () => {
      this.playing = true
      this.howler?.fade(0, this.volume, 400)
      this.pipLyric?.play()
    })
  }
  togglePlay() {
    if (this.howler?.playing()) {
      this.pause()
    } else {
      this.play()
    }
  }
  replay() {
    this.howler?.seek(0)
    this.howler?.play()
  }
  next() {
    if (this.store.playMode === PLAY_MODE.REPEAT_ONCE) {
      this.replay()
      return
    }
    const trackId = this.nextTrackId()
    if (trackId) {
      this.updatePlayerTrack(trackId)
    } else {
      this.pause()
    }
  }
  async nextFm() {
    if (!this.store.isCurrentFm) {
      this.store.$state.isCurrentFm = true
    }
    const track = await this.store.updatePersonalFmList()
    if (track?.id) {
      this.updatePlayerTrack(track.id, true, true, true)
    }
  }
  prev() {
    if (this.store.playMode === PLAY_MODE.REPEAT_ONCE) {
      this.replay()
      return
    }
    // 当前播放歌曲超过 30s，点击上一曲倒退回初始
    if (this.howler!.seek() > 30) {
      this.replay()
      return
    }
    const trackId = this.prevTrackId()
    if (typeof trackId === 'string' || typeof trackId === 'number') {
      this.updatePlayerTrack(trackId)
    } else {
      this.pause()
    }
  }
  private nextTrackId() {
    return this.store.popNextTrackId()
  }
  private prevTrackId() {
    return this.store.popPrevTrackId()
  }
  updateCurrentTime(this: Player, val?: number) {
    const current = val ?? Math.ceil(this.howler?.seek() ?? 0)
    this.currentTime = current
    this.store.currentTime = current
    this.pipLyric?.updateTime(current)
    // if (this.taskbarProgress && this.track?.dt) {
    //   const p = current / (this.track.dt / 1000)
    //   const progress = p >= 1 ? 1 : p
    //   this.ipcRenderer.invoke('setProgress', progress)
    // }
  }
  setSeek(val: number) {
    this.howler?.seek(val)
    this.updateCurrentTime()
  }
  pauseProgress() {
    clearTimeout(this.progressInterval)
    this.progressInterval = void 0
  }
  restoreProgress() {
    this.setProgressInterval()
  }
  setoutputDevice() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.howler?._sounds.length) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const soundNode = this.howler._sounds[0]._node
      if (this.settingStore.outputdevice && soundNode?.setSinkId) {
        soundNode.setSinkId(this.settingStore.outputdevice)
      }
    }
  }
  private setProgressInterval(this: Player) {
    this.progressInterval = setTimeout(() => {
      if (this.howler?.playing() && this.progressInterval) {
        this.updateCurrentTime()
        this.setProgressInterval()
      }
    }, 1000)
  }
  private endCb() {
    if (this.store.isCurrentFm) {
      this.nextFm()
    } else {
      this.next()
    }
    if (this.track) {
      this.endPlay(this.track, 0, true)
    }
  }
  // 接口无效 暂时不用
  private async endPlay(track: Track, time: number, played = false) {
    const { id, dt = 0 } = track

    const sourceId: number = this.store.getSourceId()
    if (played) {
      time = +dt / 1000
    }
    if (time) {
      console.log('歌曲打卡', this.track?.name, Math.ceil(time), played)
      try {
        await end({
          id,
          sourceId: sourceId || '',
          time: Math.ceil(time),
        })
      } catch (e) {
        console.log('打卡失败', e)
      }
    }
  }
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
  private t(key: string) {
    return this.i18n.global.t(key)
  }
}
