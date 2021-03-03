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
  // pluginOptions: {
  //   // electron-builder的配置文件
  //   electronBuilder: {
  //     builderOptions: {
  //       productName: 'IPlayer',
  //       copyright: 'Copyright © IPlayer',
  //       asar: true,
  //       directories: {
  //         output: 'dist_electron',
  //       },
  //       mac: {
  //         target: [
  //           {
  //             target: 'dmg',
  //             arch: ['arm64', 'x64'],
  //           },
  //           {
  //             target: 'zip',
  //             arch: ['arm64', 'x64'],
  //             // arch: ["universal"]
  //           },
  //         ],
  //         artifactName: '${productName}-${arch}.${ext}',
  //         category: 'public.app-category.music',
  //         darkModeSupport: true,
  //       },
  //       win: {
  //         target: ['nsis', 'portable'],
  //         publisherName: 'IPlayer',
  //         icon: 'build/icons/icon.ico',
  //         publish: ['github'],
  //       },
  //       linux: {
  //         target: ['AppImage', 'tar.gz', 'deb', 'rpm', 'snap', 'pacman'],
  //         category: 'Music',
  //         icon: './build/icon.icns',
  //       },
  //       dmg: {
  //         icon: 'build/icons/icon.icns',
  //       },
  //       nsis: {
  //         oneClick: false,
  //         allowToChangeInstallationDirectory: true,
  //         perMachine: true,
  //       },
  //     },
  //   },
  // },
}
