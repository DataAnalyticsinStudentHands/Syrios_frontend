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
import { publicEnvironmentGuard } from './scripts/publicEnvironment.mjs'

export default defineConfig(({ mode }) => ({
  // MODE selects asset/router URLs at build time; container runtime variables
  // cannot change the embedded /dev/ staging prefix after the build.
  base: mode === 'staging' ? '/dev/' : '/',

  plugins: [react(), publicEnvironmentGuard()],

  resolve: {
    alias: {
      src: path.resolve(import.meta.dirname, './src'),
    },
  },

  build: {
    outDir: 'build',
  },

  preview: {
    // Local preview only; the PM2 configurations serve published builds.
    host: 'localhost',
    port: 4173,
    strictPort: true,
    allowedHosts: ['syrios.uh.edu'],
  },
}))
