const express = require('express');
const bodyParser = require('body-parser');
const cache = require('NeteaseCloudMusicApi/util/apicache').middleware;
const fileUpload = require('express-fileupload');
const apiMap = require('./apimap');
export const createApiServer = () => {
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
      });
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next();
  });

  // cookie parser
  app.use((req, res, next) => {
    req.cookies = {};
    (req.headers.cookie || '').split(/\s*;\s*/).forEach((pair) => {
      let crack = pair.indexOf('=');
      if (crack < 1 || crack == pair.length - 1) return;
      req.cookies[
        decodeURIComponent(pair.slice(0, crack)).trim()
      ] = decodeURIComponent(pair.slice(crack + 1)).trim();
    });
    next();
  });

  // body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(fileUpload());

  // cache
  app.use(cache('2 minutes', (req, res) => res.statusCode === 200));

  Object.entries(apiMap).map(([k, v]) => {
    app.use(k, v);
  });

  // router
const special = {
  'daily_signin.js': '/daily_signin',
  'fm_trash.js': '/fm_trash',
  'personal_fm.js': '/personal_fm',
};

// todo 
// const apiModulePath = path.resolve(
//   require.resolve('NeteaseCloudMusicApi'),
//   '../module',
// );
// fs.readdirSync(apiModulePath)
//   .reverse()
//   .forEach((file) => {
//     if (!file.endsWith('.js')) return;
//     let route =
//       file in special
//         ? special[file]
//         : '/' + file.replace(/\.js$/i, '').replace(/_/g, '/');
//     let question = require(`NeteaseCloudMusicApi/module/${file}`);

//     app.use(route, (req, res) => {
//       if (typeof req.query.cookie === 'string') {
//         req.query.cookie = cookieToJson(req.query.cookie);
//       }
//       let query = Object.assign(
//         {},
//         { cookie: req.cookies },
//         req.query,
//         req.body,
//         req.files,
//       );
//       question(query, request)
//         .then((answer) => {
//           console.log('[OK]', decodeURIComponent(req.originalUrl));
//           res.append('Set-Cookie', answer.cookie);
//           res.status(answer.status).send(answer.body);
//         })
//         .catch((answer) => {
//           console.log('[ERR]', decodeURIComponent(req.originalUrl), {
//             status: answer.status,
//             body: answer.body,
//           });
//           if (answer.body.code == '301') answer.body.msg = '需要登录';
//           res.append('Set-Cookie', answer.cookie);
//           res.status(answer.status).send(answer.body);
//         });
//     });
//   });
  const port = process.env.API_PORT || 12138;
  const host = process.env.HOST || '127.0.0.1';

  app.server = app.listen(port, host, () => {
    console.log(`server running @ http://${host ? host : 'localhost'}:${port}`);
  });
};
