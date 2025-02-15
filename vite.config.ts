import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import injectEnvToHtml from './plugins/inject-env-to-html.ts'

// https://vite.dev/config/
/** @type {import('vite').UserConfig} */
export default ({ mode = 'development' }) => {
  // Load app-level env vars to node-level env vars.
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  }

  return defineConfig({
    /* mode: mode || 'development', */
    plugins: [
      react(),
      tailwindcss(),
      injectEnvToHtml(),
    ],
    server: {
      // hmr: false,
      // host: 'localhost', // 0.0.0.0 for all interfaces
      port: 5002,
      /* allowedHosts: [
        '127.0.0.1',
        'localhost',
      ], */
      watch: {
        ignored: ['**/api-data/*.*', './TODO.txt'],
      },
    }
  })
}
