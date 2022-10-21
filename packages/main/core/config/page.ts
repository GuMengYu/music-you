import { app } from 'electron'
import is from 'electron-is'
import Store from 'electron-store'
export interface PageOption {
  width: number
  height: number
  minWidth: number
  minHeight: number
  bindCloseToHide?: boolean
  url: string
}
export type Pages = 'index' | 'minimal'

const IndexUrl = app.isPackaged
  ? 'http://127.0.0.1:12140'
  : `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

let storeSize: {
  width: number
  height: number
} = {
  width: 1200,
  height: 720,
}
initWindowSize()
function initWindowSize() {
  const store = new Store()

  const size = store.get('windowSize')
  if (size) {
    try {
      storeSize = JSON.parse(store.get('windowSize') as string)
    } catch (e) {
      console.log(e)
    }
  }
}
export default {
  index: {
    width: storeSize.width,
    height: storeSize.height,
    minWidth: 393,
    minHeight: 600,
    // transparent: !is.windows(),
    bindCloseToHide: true,
    url: IndexUrl,
  },
  // minimal: {
  //   width: 300,
  //   height: 300,
  //   minWidth: 256,
  //   minHeight: 256,
  //   url: `${IndexUrl}/minimal`,
  // },
} as Record<Pages, PageOption>
