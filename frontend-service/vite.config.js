import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8009',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:8010',
        changeOrigin: true,
        ws: true,
      },
      '/payment': {
        target: 'http://localhost:8011',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/payment/, ''),
      },
    },
  },
})
