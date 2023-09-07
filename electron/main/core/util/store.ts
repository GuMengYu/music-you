import Store from 'electron-store'

import log from './log'

log.info('[main] init store')

export interface StoreType {
  windowSize: {
    width: number
    height: number
  }
  youtube: {
    open: boolean
    proxy: {
      host: string
      port: number
      protocol?: string
    }
  }
  windowPosition: any
}

const store = new Store<StoreType>({
  defaults: {
    windowSize: {
      height: 720,
      width: 1210,
    },
    windowPosition: null,
    youtube: {
      open: false,
      proxy: {
        host: '127.0.0.1',
        port: 7890,
        protocol: 'http',
      },
    },
  },
})

export default store
