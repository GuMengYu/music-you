import { rmSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'

import { defineConfig, loadEnv } from 'vite'
import pkg, { dependencies, devDependencies, name, version } from './package.json'

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: new Date().toISOString(),
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, './'))
  const plugins: any = [
    react(),
  ]
  return {
    mode,
    envDir: path.resolve(__dirname, './'),
    root: __dirname,
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '@shared': path.resolve(__dirname, 'shared'),
      },
    },
    plugins,
    // server: process.env.VSCODE_DEBUG && (() => {
    //   const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
    //   return {
    //     host: url.hostname,
    //     port: +url.port,
    //   }
    // })(),
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
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    clearScreen: false,
  }
})
