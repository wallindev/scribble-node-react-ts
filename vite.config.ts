import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindCss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), 'server'), '')
  return {
    base: '/frontend/',
    build: {
      outDir: 'frontend',
      // outDir: '../public/frontend', // For when it's moved to Laravel structure
      // emptyOutDir: true,
    },
    define: {
      'process.env': env,
    },
    plugins: [
      react(),
      tailwindCss(),
    ],
    server: {
      // hmr: false,
      // host: 'localhost', // 0.0.0.0 for all interfaces
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT}`, // Local API during dev
          changeOrigin: true,
        },
      },
      port: 5002,
      // allowedHosts: ['127.0.0.1', '192.168.32.2', 'grunge', 'grungecorp', 'grunge.dev', 'grungecorp.dev'],
      watch: {
        ignored: ['**/api-data/*.*', './TODO.txt'],
      },
    },
  }
})
