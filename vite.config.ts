/* eslint-disable import/no-unresolved */

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { VitePWA } from 'vite-plugin-pwa'

// import vuetify from 'vite-plugin-vuetify'
import { dependencies, devDependencies, name, version } from './package.json'
const path = require('path')

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date().toISOString(),
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, './'))

  const isDevelopment = command === 'serve'
  const isProduction = command === 'build'
  const isElectron = mode === 'electron'

  const plugins: any = [
    vue({
      reactivityTransform: true,
    }),
    // vuetify({
    //   styles: 'expose',
    //   autoImport: false,
    // }),
    vueJsx(),
    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router', 'vue/macros', '@vueuse/head', '@vueuse/core'],
      dts: './src/auto-imports.d.ts',
    }),
    Components({
      dts: './src/components.d.ts',
    }),
  ]
  if (isElectron) {
    plugins.push(
      electron([
        {
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap: isDevelopment,
              minify: isProduction,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys(dependencies ?? {}),
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: isDevelopment,
              minify: isProduction,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(dependencies ?? {}),
              },
            },
          },
        },
      ]),
      renderer({
        nodeIntegration: true,
      })
    )
  } else {
    plugins.push(
      VitePWA({
        includeAssets: ['favicon.ico'],
        manifest: {
          name: 'Music You',
          short_name: 'Music You',
          theme_color: '#fdfcf4',
          icons: [
            {
              src: 'icon/icon@192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icon/icon@512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        registerType: 'autoUpdate',
        devOptions: {
          enabled: isDevelopment,
          type: 'module',
          navigateFallback: 'index.html',
        },
      })
    )
  }
  return {
    mode: mode,
    envDir: path.resolve(__dirname, './'),
    root: __dirname,
    plugins: plugins,
    base: './',
    build: {
      emptyOutDir: true,
      sourcemap: isDevelopment,
      // rollupOptions: {
      //   output: {
      //     format: buildElectron ? 'cjs' : 'es',
      //   },
      // },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST,
      port: +env.VITE_DEV_SERVER_PORT,
      proxy: {
        '/api': {
          target: `http://${env.VITE_API_SERVER_HOST}:${env.VITE_API_SERVER_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
