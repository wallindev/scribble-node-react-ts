import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindCss from '@tailwindcss/vite'

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    react(),
    tailwindCss(),
  ],
  // build: {
  //   outDir: 'dist',
  // },
  server: {
    // hmr: false,
    // host: 'localhost', // 0.0.0.0 for all interfaces
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Local API during dev
        changeOrigin: true,
      },
    },
    port: 5000,
    // allowedHosts: ['127.0.0.1', '192.168.32.2', 'grunge', 'grungecorp', 'grunge.dev', 'grungecorp.dev'],
    watch: {
      ignored: ['**/api-data/*.*', './TODO.txt'],
    },
  },
})
