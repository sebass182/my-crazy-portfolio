import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // served from the root of sebastienlemyre.com (see public/CNAME)
  plugins: [react()],
})
