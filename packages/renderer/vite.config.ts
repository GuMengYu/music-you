/* eslint-disable import/no-unresolved */

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import vuetify from '@vuetify/vite-plugin'
import { defineConfig, loadEnv } from 'vite'
import polyfillExports from 'vite-plugin-electron/polyfill-exports'
import electron from 'vite-plugin-electron/renderer'
import resolve from 'vite-plugin-resolve'

import { dependencies, devDependencies, name, version } from '../../package.json'
const path = require('path')

const env = loadEnv('', path.resolve(__dirname, '../../'))

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date().toISOString(),
}

enum BUILDMODE {
  DEV = 'development',
  PROD = 'production',
  ELECTRON_DEV = 'development-electron',
  ELECTRON_PROD = 'production-electron',
}
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const buildElectron = mode == BUILDMODE.ELECTRON_DEV || mode == BUILDMODE.ELECTRON_PROD
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
  if (buildElectron) {
    plugins.push(
      electron(),
      resolve(
        /**
         * Here you can specify other modules
         * 🚧 You have to make sure that your module is in `dependencies` and not in the` devDependencies`,
         *    which will ensure that the electron-builder can package it correctly
         */
        {
          // If you use electron-store, this will work
          'electron-store': 'const Store = require("electron-store"); export default Store;',
        }
      ),
      polyfillExports()
    )
  }
  return {
    mode: mode,
    envDir: path.resolve(__dirname, '../../'),
    root: __dirname,
    plugins: plugins,
    base: './',
    build: {
      outDir: '../../dist/renderer',
      emptyOutDir: true,
      sourcemap: mode === BUILDMODE.DEV || mode === BUILDMODE.ELECTRON_DEV,
      rollupOptions: {
        format: buildElectron ? 'cjs' : 'es',
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env': {},
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST,
      port: +env.VITE_DEV_SERVER_PORT,
      proxy: {
        '/api': {
          target: `http://${env.VITE_API_SERVER_HOST}:${buildElectron ? 12141 : env.VITE_API_SERVER_PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
    resolve: {
      extensions: [
        '.js',
        '.json',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.vue',
      ]
    },
    */
  }
})
