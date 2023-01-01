const match = require('@unblockneteasemusic/server')
const axios = require('axios')
const apis = {
  '/unlockmusic': async (req, res) => {
    try {
      const trackId = req.query.id
      console.log('try to unlock music', req.query.id)
      const result = await match(trackId, ['qq', 'kuwo', 'migu'])
      res.send(JSON.stringify({ code: 200, data: result }))
    } catch (e) {
      res.sendStatus(500)
    }
  },
  '/wallhaven/search': async (req, res) => {
    const { query: params } = req
    try {
      const { data } = await axios.get('https://wallhaven.cc/api/v1/search', {
        params,
      })
      res.send(JSON.stringify({ data, code: 200 }))
    } catch (e) {
      res.sendStatus(500)
    }
  },
  '/wallhaven/get/:id': async (req, res) => {
    const { params, query } = req
    try {
      const {
        data: { data },
      } = await axios.get(`https://wallhaven.cc/api/v1/w/${params.id}`, {
        params: query,
      })
      res.send(JSON.stringify({ data, code: 200 }))
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
    return axios.get('https://wallhaven.cc/api/v1/search')
  },
  '/wallhaven/tag/:id': async (req, res) => {
    const { params, query } = req
    try {
      const {
        data: { data },
      } = await axios.get(`https://wallhaven.cc/api/v1/tag/${params.id}`, {
        params: query,
      })
      res.send(JSON.stringify({ data, code: 200 }))
    } catch (e) {
      console.log(e)
      res.sendStatus(500)
    }
    return axios.get('https://wallhaven.cc/api/v1/search')
  },
}

export function useOtherServer(app) {
  if (app) {
    Object.entries(apis).map(([url, fn]) => {
      app.use(url, fn)
    })
  }
}
