import { TArticle, TFlashMessage } from '../types/general.types'

export let defaultArticle: TArticle = {
  id: null,
  title: '',
  content: '',
  created: undefined,
  modified: ''
}

export let defaultFlashMessage: TFlashMessage = {
  message: '',
  type: 'success',
  visible: false
}