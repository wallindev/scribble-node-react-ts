import path from 'node:path'
import dotenv from 'dotenv'

let filePathEnv
try {
  filePathEnv = path.resolve(process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env')
  !filePathEnv && console.error('Env file not found')
} catch (error) {
  console.error(`Error reading or parsing '${filePathEnv}' file:\n${error}`)
} finally {
  dotenv.config({ path: filePathEnv })
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