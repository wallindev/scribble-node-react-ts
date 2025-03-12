import axios from 'axios'
import { API_PATH } from './constants'

// const location = window.location
// console.log('location:', location)
// console.log('location.protocol:', location.protocol)
// console.log('location.hostname:', location.hostname)
// console.log('location.port:', location.port)

// const fullUrl = `${location.protocol}//${location.hostname}${location.port ? `:${location.port}` : ''}`
// console.log('fullUrl:', fullUrl)

axios.defaults.baseURL = API_PATH
