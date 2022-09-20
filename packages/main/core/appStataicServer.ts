import { createProxyMiddleware } from 'http-proxy-middleware'
import { join } from 'path'
import polka from 'polka'
import sirv from 'sirv'

import log from './util/log'

export function useStaticServer() {
  log.info('static app create')
  const assets = sirv(join(__dirname, '../renderer'))
  polka()
    .use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:12141',
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
      })
    )
    .use(assets)
    .listen(12140, () => {
      log.info('app run in port 12140')
    })
}
