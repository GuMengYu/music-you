// import { resolve } from 'path'
// const outerModule = resolve(__dirname, '../../../NeteaseCloudMusicApi')
const neteaseApi = require('NeteaseCloudMusicApi')
export const useNetEaseApiServer = (
  options = {
    port: 12141,
    host: '127.0.0.1',
  }
) => {
  return neteaseApi.serveNcmApi(options)
}
