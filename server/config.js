import path from 'node:path'
import env from 'dotenv'

let filePathEnv
try {
  filePathEnv = path.resolve(`./server/.env${process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''}`)
  !filePathEnv && console.error('Env file not found')
  env.config({ path: filePathEnv })
} catch (error) {
  console.error(`Error reading or parsing '${filePathEnv}' file:\n${error}`)
}

// Implement this? Use httpOnly and secure cookies!
// Axios interceptor
/* axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}) */