const path = require('path');
module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
    devServer: {
      port: process.env.VUE_APP_PORT || 8080,
      proxy: {
        '/api': {
          target: `http://localhost:${
            process.env.VUE_APP_API_DEV_PORT || 3000
          }`,
          pathRewrite: { '^/api': '/' },
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@util': path.resolve(__dirname, 'src/util'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@api': path.resolve(__dirname, 'src/api'),
      },
    },
    optimization: {
      removeAvailableModules: process.env.NODE_ENV === 'production',
      removeEmptyChunks: process.env.NODE_ENV === 'production',
      splitChunks: {
        chunks: 'all',
        maxAsyncRequests: 20,
        maxInitialRequests: 5,
        minSize: 30000,
        cacheGroups: {
          libs: {
            name: 'chunk-vender-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial', // only package third parties that are initially dependent
          },
          vuetify: {
            name: 'chunk-vuetify-lib',
            test: /[\\/]vuetify[\\/]lib[\\/]/,
            priority: 20,
          },
        },
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true, // https://github.com/electron/electron/issues/9920#issuecomment-653978691
      builderOptions: {
        productName: 'VPlayer',
        copyright: 'Copyright © VPlayer 2022', //版权信息
        asar: true,
        win: {
          publisherName: 'VPlayer',
          icon: 'build/icons/icon.ico',
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
          target: [
            {
              target: 'dmg',
              arch: ['x64', 'arm64', 'universal'],
            },
          ],
          artifactName: '${productName}_${version}.${ext}',
          darkModeSupport: true,
          category: 'public.app-category.music',
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
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: 'build/icons/icon.ico', // 安装图标
          uninstallerIcon: 'build/icons/icon.ico', //卸载图标
          installerHeaderIcon: 'build/icons/icon.ico', // 安装时头部图标
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: 'VPlayer', // 图标名称
          deleteAppDataOnUninstall: true,
        },
        dmg: {
          icon: 'build/icons/icon.icns',
        },
      },
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/background.js',
    },
  },
};
