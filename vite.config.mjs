/**
 * vite.config.mjs
 *
 * - Local development runs at /
 * - Staging is built for /dev/
 * - Production is built for /
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  // Staging is deployed under /dev/; production and local development use /.
  base: mode === 'staging' ? '/dev/' : '/',

  plugins: [react()],

  resolve: {
    alias: {
      src: path.resolve(import.meta.dirname, './src'),
    },
  },

  build: {
    outDir: 'build',
  },

  preview: {
    host: 'localhost',
    port: 4173,
    strictPort: true,
    allowedHosts: ['syrios.uh.edu'],
  },
}))
