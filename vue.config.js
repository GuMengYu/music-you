const path = require('path');
module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@util': path.resolve(__dirname, 'src/util'),
        '@assets': path.resolve(__dirname, 'src/assets'),
      },
    },
  },
}
