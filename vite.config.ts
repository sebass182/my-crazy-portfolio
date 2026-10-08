import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/my-crazy-portfolio/', // GitHub Pages serves the site from a subpath
  plugins: [react()],
})
