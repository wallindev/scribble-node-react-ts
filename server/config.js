import path from 'node:path'
import dotenv from 'dotenv'
import { __dirname } from './constants.js'

/*
 * These are set in the different npm run-scripts
 * after the principle that everything is run
 * live/remotely and in production unless
 * otherwise stated. That way, there is
 * less and less clutter the closer
 * we are to the finished app.
 */
export const NODE_ENV = process.env.NODE_ENV || 'production'
export const RUN_ENV = process.env.RUN_ENV  || 'live'

export const   DEV_ENV = process.env.NODE_ENV === 'development'
export const  TEST_ENV = process.env.NODE_ENV === 'test'
export const  PROD_ENV = process.env.NODE_ENV === 'production'
export const  IS_LOCAL = process.env.RUN_ENV  === 'local'
export const   IS_LIVE = !IS_LOCAL

export let envFileVars = {}
if (IS_LOCAL) {
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

export let envConfigVars = {}
if (IS_LIVE) {
  envConfigVars['CSS_PATH']   = process.env.CSS_PATH   || '/css/index.css'
  envConfigVars['DB_PATH']    = process.env.DB_PATH    || './api-data/db.json'
  envConfigVars['JWT_SECRET'] = process.env.JWT_SECRET || 'b029f401e21027eb9ddb4204f6aad6923c192ea2323b2bbb96d031c2c0a18051'
  envConfigVars['PORT']       = process.env.PORT       || 3000
}

// Implement this? Use httpOnly and secure cookies!
// Axios interceptor
/* axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}) */
