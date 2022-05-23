import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { join } from 'path'

import log from './util/log'

export function useStaticServer() {
  log.info('static app create')
  const app = express()
  const staticPath = join(__dirname, '../renderer')
  app.use('/', express.static(staticPath))
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:12141',
      changeOrigin: true,
      pathRewrite: (path) => path.replace(/^\/api/, ''),
    }) as express.RequestHandler
  )
  return app.listen(12140, '', () => {
    log.info('app run in port 12140')
  })
}
