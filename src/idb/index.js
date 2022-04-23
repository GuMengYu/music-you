import axios from 'axios'
import Dexie from 'dexie'

export class PlayerIDB extends Dexie {
  constructor() {
    super('vplayer')
    this.size = 0
    this.init()
  }
  init() {
    this.version(1).stores({
      tracks: '++id, createTime',
    })
    this.calcSize()
  }
  async cacheTrack(track, cacheLimit = 1024) {
    const cacheLimitByte = cacheLimit * Math.pow(1024, 2)
    const { name, id, url } = track
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      })
      this.tracks.put({
        id,
        track,
        buffer: response.data,
        createTime: new Date().getTime(),
      })
      console.log(`cache track ${id} ${name}`)
      // overflow
      if (this.size > cacheLimitByte || this.size + response.data.byteLength > cacheLimitByte) {
        this.removeOverflowCache()
      }
    } catch (e) {
      console.error(e)
    }
    return track
  }
  async getTrack(id) {
    const track = await this.tracks.get(+id)
    if (!track) return null
    console.log(`get cached track ${track?.id} - ${track?.track.name}`)
    return track
  }
  clearIDB() {
    return new Promise((resolve) => {
      for (const table of this.tables) {
        table.clear()
      }
      resolve()
    })
  }
  async calcSize() {
    const { usageDetails } = await navigator.storage.estimate()
    this.size = usageDetails.indexedDB ?? 0
    return this.size
  }
  async removeOverflowCache() {
    try {
      const trackMeta = await this.tracks.orderBy('createTime').first()
      await this.tracks.delete(trackMeta.id)
      console.log(
        `removeOverflowCache, track: ${trackMeta.id} - ${trackMeta.track?.name}, size: ${trackMeta.buffer.byteLength}`
      )
    } catch (error) {
      console.log('removeOverflowCache', error)
    }
  }
}

export const playerIDB = new PlayerIDB()
