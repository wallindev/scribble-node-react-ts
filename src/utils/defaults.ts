// import type { AxiosRequestConfig } from 'axios'
import { Color, MessageType } from '../types/general.types'
import type { TArticle, TColor, TFlashMessage, TUser } from '../types/general.types'
// import { getAuthToken, hasAuthToken } from './functions'

export const defaultTitleText = '[Title Here]'
export const defaultContentText = '[Content Here]'

// This doesn't work because the token is set the first time this file is being imported,
// instead being dynamically fetched with every API request. Moving this to a function instead.
// export const defaultRequestConfig: AxiosRequestConfig | any = hasAuthToken() ? {
//   headers: {
//     Authorization: `Bearer ${getAuthToken()}`
//   }
// } : {}

export const defaultColors: TColor = {
  success: Color.Green,
  info: Color.Blue,
  warning: Color.Yellow,
  error: Color.Red
}

export const defaultArticle: TArticle = {
  id: null,
  title: '',
  content: '',
  created: null,
  modified: '',
  userId: 0
}

export const defaultUser: TUser = {
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

export const defaultFlashMessage: TFlashMessage = {
  message: '',
  type: MessageType.Success,
  visible: false
}
