import { TArticle, TFlashMessage, TUser } from '../types/general.types'
import { getAuthToken, hasAuthToken } from './functions'
import type { AxiosRequestConfig } from 'axios'

export const defaultRequestConfig: AxiosRequestConfig | any = hasAuthToken() ? {
  headers: {
    Authorization: `Bearer ${getAuthToken()}`
  }
} : {}

export let defaultArticle: TArticle = {
  id: null,
  title: '',
  content: '',
  created: null,
  modified: '',
  userId: 0
}
export const defaultTitleText = '[Title Here]'
export const defaultContentText = '[Content Here]'

export let defaultUser: TUser = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  password: null,
  passwordConfirm: null,
  authToken: null,
  created: null,
  modified: ''
}

export let defaultFlashMessage: TFlashMessage = {
  message: '',
  type: 'success',
  visible: false
}