const bodyParser = require('body-parser')
const cache = require('NeteaseCloudMusicApi/util/apicache').middleware
const fileUpload = require('express-fileupload')
const decode = require('safe-decode-uri-component')
const express = require('express')
import apiMap from './apimap'
export const createApiServer = () => {
  const app = express()

  app.set('trust proxy', true)
  // CORS & Preflight request
  app.use((req, res, next) => {
    if (req.path !== '/' && !req.path.includes('.')) {
      res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8',
      })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
  })

  // cookie parser
  app.use((req, res, next) => {
    req.cookies = {}
    //;(req.headers.cookie || '').split(/\s*;\s*/).forEach((pair) => { //  Polynomial regular expression //
    ;(req.headers.cookie || '').split(/;\s+|(?<!\s)\s+$/g).forEach((pair) => {
      const crack = pair.indexOf('=')
      if (crack < 1 || crack == pair.length - 1) return
      req.cookies[decode(pair.slice(0, crack)).trim()] = decode(pair.slice(crack + 1)).trim()
    })
    next()
  })

  // body parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(fileUpload())

  // cache
  app.use(cache('2 minutes', (req, res) => res.statusCode === 200))

  Object.entries(apiMap).map(([k, v]) => {
    app.use(k, v)
  })

  const port = process.env.API_PORT || 9902
  const host = process.env.HOST || '127.0.0.1'

  app.server = app.listen(port, host, () => {
    console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
  })
}
