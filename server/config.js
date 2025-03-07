import path from 'node:path'
import dotenv from 'dotenv'
import { __dirname } from './constants.js'

process.env.NODE_ENV ||= 'development'
process.env.RUN_ENV ||= 'local'

export const   DEV_ENV = process.env.NODE_ENV === 'development'
export const  TEST_ENV = process.env.NODE_ENV === 'test'
export const  PROD_ENV = process.env.NODE_ENV === 'production'
export const LOCAL_ENV = process.env.RUN_ENV  === 'local'
export const  LIVE_ENV = !LOCAL_ENV

let envFileVars = {}
if (LOCAL_ENV) {
  let filePathEnv, result
  try {
    filePathEnv = path.join(__dirname, '.env')
    if (filePathEnv) {
      result = dotenv.config({ path: filePathEnv })
    } else {
      console.error('Env file not found')
    }
    envFileVars = result.parsed
  } catch (error) {
    console.error(`Error reading or parsing '${filePathEnv}' file:\n${error}`)
  }
}
export default envFileVars

// Implement this? Use httpOnly and secure cookies!
// Axios interceptor
/* axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}) */
