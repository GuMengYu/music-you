const path = require('path');
module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: 'source-map',
    devServer: {
      port: process.env.SERVER_PORT,
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
      builderOptions: {
        productName: 'VPlayer',
        asar: true,
        win: {
          target: [
            {
              target: 'nsis',
              arch: ['x64'],
            },
            {
              target: 'portable',
              arch: ['x64'],
            },
          ],
        },
        mac: {
          target: 'dmg',
          category: 'public.app-category.music',
          artifactName: '${productName}_${version}.${ext}',
          darkModeSupport: true,
        },
        linux: {
          target: [
            'AppImage',
            'snap',
            'deb',
            'rpm',
            'freebsd',
            'pacman',
            'tar.xz',
          ],
          category: 'Audio',
        },
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/electron/background.js',
    },
  },
};
