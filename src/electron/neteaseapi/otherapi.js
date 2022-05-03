const match = require('@njzy/unblockneteasemusic');
const axios = require('axios');
const cheerio = require('cheerio');
module.exports = {
  '/unlockmusic': async (req, res) => {
    try {
      const trackId = req.query.id;
      const result = await match(trackId, void 0);
      res.send(JSON.stringify({ code: 200, data: result }));
    } catch (e) {
      res.sendStatus(500);
    }
  },
  '/wallhaven/search': async (req, res) => {
    const { query: params } = req;
    try {
      const { data } = await axios.get('https://wallhaven.cc/api/v1/search', {
        params,
      });
      res.send(JSON.stringify({ data, code: 200 }));
    } catch (e) {
      res.sendStatus(500);
    }
  },
  '/wallhaven/get/:id': async (req, res) => {
    const { params, query } = req;
    try {
      const {
        data: { data },
      } = await axios.get(`https://wallhaven.cc/api/v1/w/${params.id}`, {
        params: query,
      });
      res.send(JSON.stringify({ data, code: 200 }));
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
    return axios.get('https://wallhaven.cc/api/v1/search');
  },
  '/wallhaven/tag/:id': async (req, res) => {
    const { params, query } = req;
    try {
      const {
        data: { data },
      } = await axios.get(`https://wallhaven.cc/api/v1/tag/${params.id}`, {
        params: query,
      });
      res.send(JSON.stringify({ data, code: 200 }));
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
    return axios.get('https://wallhaven.cc/api/v1/search');
  },
  '/wallhaven/index': async (req, res) => {
    try {
      const { data } = await axios.get('https://wallhaven.cc/');
      const $ = cheerio.load(data);
      const hotTags = $('.pop-tags .pop-tag-item')
        .map((idx, item) => {
          const link = $(item).find('a');
          const tagUrl = new URL(link.attr('href'));
          const id = tagUrl.searchParams.get('q');
          return {
            id: id,
            name: link.text(),
          };
        })
        .get();
      const feats = $('.feat-row .lg-thumb,.sm-thumb')
        .map((idx, item) => {
          const $item = $(item);
          const size = $item.attr('class').split('-')[0];
          const link = $item.children('a');
          const _link = link.attr('href').split('/');
          const id = _link[_link.length - 1];
          return {
            size,
            id: id,
            thumb: $(link).find('img').attr('src'),
          };
        })
        .get();
      res.send(JSON.stringify({ data: { hotTags, feats }, code: 200 }));
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  },
};
