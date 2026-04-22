/**
 * vite.config.js — Vite config for local dev, Apache-proxied dev, and preview/build
 *
 * Modes:
 * - local dev (`npm run dev`) runs at `/`
 * - Apache-proxied dev (`npm run dev:proxy`) runs at `/dev/`
 * - production build and preview run at `/`
 *
 * Notes:
 * - `src` alias is enabled so imports like `src/components/...` resolve correctly
 * - proxy dev mode is enabled through `VITE_PROXY_DEV=true`
 *
 * Important:
 * - Files containing JSX must use the `.jsx` extension
 * - Imports should be extensionless where possible
 * - React Router basename should stay aligned with Vite's `base`
 * - Apache proxy rules for `/dev/` must come before the catch-all `/`
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, isPreview }) => {
  const common = {
    plugins: [react()],
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
      },
    },
  }

  const isProxyDev = process.env.VITE_PROXY_DEV === 'true'

  // Dev server
  if (command === 'serve' && !isPreview) {
    return {
      ...common,
      base: isProxyDev ? '/dev/' : '/',
      server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        allowedHosts: isProxyDev ? ['syrios.uh.edu'] : true,
      },
    }
  }

  // Production build
  if (command === 'build') {
    return {
      ...common,
      base: '/',
    }
  }

  // Preview production build
  if (isPreview) {
    return {
      ...common,
      base: '/',
      preview: {
        host: '127.0.0.1',
        port: 4173,
        strictPort: true,
        allowedHosts: ['syrios.uh.edu'],
      },
    }
  }

  return common
})