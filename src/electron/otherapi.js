const match = require('@njzy/unblockneteasemusic');
module.exports = {
  '/unlockmusic': async (req, res) => {
    const trackId = req.query.id;
    const result = await match(trackId, void 0);
    const re = { code: 200, data: result };
    res.send(JSON.stringify(re));
  },
};
