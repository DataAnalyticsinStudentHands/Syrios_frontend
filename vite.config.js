/**
 * vite.config.js — Vite migration config
 *
 * Notes:
 * - `src` alias is enabled so imports like `src/components/...` resolve correctly
 * - local dev runs at `/`
 * - build currently uses `/dev/` as base path
 *
 * Important:
 * - Files containing JSX must be renamed to `.jsx`
 * - Imports should be extensionless where possible
 * - Avoid mixing Vite `base` and React Router `basename` for the same path prefix
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
})