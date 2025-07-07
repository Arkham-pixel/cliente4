// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.59.106.174:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // opcional: alias global → window
  define: {
    global: 'window'
  }
})
