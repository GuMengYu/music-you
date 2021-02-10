const express = require('express')
const bodyParser = require('body-parser')
const cache = require('NeteaseCloudMusicApi/util/apicache').middleware
const fileUpload = require('express-fileupload')
const { cookieToJson } = require('NeteaseCloudMusicApi/util/index')

const request = require('NeteaseCloudMusicApi/util/request')

import * as routes from './routes';

export const runMusicApi = () => {
  const app = express();
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
    ;(req.headers.cookie || '').split(/\s*;\s*/).forEach((pair) => {
      let crack = pair.indexOf('=')
      if (crack < 1 || crack == pair.length - 1) return
      req.cookies[
        decodeURIComponent(pair.slice(0, crack)).trim()
        ] = decodeURIComponent(pair.slice(crack + 1)).trim()
    })
    next()
  })

  // body parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(fileUpload())

  // cache
  app.use(cache('2 minutes', (req, res) => res.statusCode === 200))
  // router
  Object.keys(routes).forEach((key) => {
    let route = '/' + key.replace(/_/g, '/');
    let fn = routes[key];
    console.log(route, routes[key]);
    app.use(route, (req, res) => {
      if (typeof req.query.cookie === 'string') {
        req.query.cookie = cookieToJson(req.query.cookie)
      }
      let query = Object.assign(
        {},
        { cookie: req.cookies },
        req.query,
        req.body,
        req.files,
      )

      fn(query, request)
        .then((answer) => {
          console.log('[OK]', decodeURIComponent(req.originalUrl))
          res.append('Set-Cookie', answer.cookie)
          res.status(answer.status).send(answer.body)
        })
        .catch((answer) => {
          console.log('[ERR]', decodeURIComponent(req.originalUrl), {
            status: answer.status,
            body: answer.body,
          })
          if (answer.body.code == '301') answer.body.msg = '需要登录'
          res.append('Set-Cookie', answer.cookie)
          res.status(answer.status).send(answer.body)
        })
    })

  });

  const port = process.env.API_PORT || 27100
  const host = process.env.HOST || ''

  app.server = app.listen(port, host, () => {
    console.log(`server running @ http://${host ? host : 'localhost'}:${port}`)
  })
}


