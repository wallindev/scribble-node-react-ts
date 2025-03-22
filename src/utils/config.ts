import axios from 'axios'
// import type { AxiosRequestConfig } from 'axios'
import { API_PATH } from './constants'
// import { getAuthToken } from './functions'

axios.defaults.baseURL = API_PATH

// Implement this? Use httpOnly and secure cookies!
// Axios interceptor
// axios.interceptors.request.use(config => {
//   config.headers.Authorization = `Bearer ${getAuthToken()}`
//   return config
// })
