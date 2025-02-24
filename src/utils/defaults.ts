import { TArticle, TFlashMessage, TUser } from '../types/general.types'

export let defaultArticle: TArticle = {
  id: null,
  title: '',
  content: '',
  created: null,
  modified: ''
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