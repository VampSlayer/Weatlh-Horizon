import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/Weatlh-Horizon/' : '/',
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    }
  }
})
