const path = require('path');
module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    devtool: 'source-map',
    devServer: {
      port: process.env.SERVER_PORT,
      // proxy: {
      //   '/api': {
      //     target: process.env.VUE_APP_API_DEV_WEB,
      //     // changeOrigin: true,
      //     pathRewrite: {'^/api' : ''},
      //   },
      // },
    },
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@util': path.resolve(__dirname, 'src/util'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true, // https://github.com/electron/electron/issues/9920#issuecomment-653978691
    },
  },
}
