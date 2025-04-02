import type { MouseEventHandler, ChangeEventHandler, ReactNode, RefObject, Dispatch, SetStateAction } from 'react'
import { To } from 'react-router-dom'
import { TFlashMessage } from './general.types'

export interface IAuthForm {
  formType: 'login' | 'register'
  onSubmit: (username: string, password: string) => void
}

export interface ICustomButton {
  type?: 'button' | 'submit' | 'reset'
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: 'small' | 'medium' | 'large'
  to?: To
  children: ReactNode
  [key: string]: any
}

export interface ILogout {
  wrapperRef: RefObject<HTMLDivElement | null>
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>
  flashMessage: TFlashMessage
  className?: string
  size?: 'small' | 'medium' | 'large'
  [key: string]: any
}

export interface ITextInput {
  className?: string
  id?: string
  name?: string
  type: string
  value?: string
  disabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  onFocus?: ChangeEventHandler<HTMLInputElement>
  [key: string]: any
}
