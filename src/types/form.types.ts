import type { MouseEventHandler, ChangeEventHandler, ReactNode } from 'react'

export interface IAuthForm {
  formType: 'login' | 'register'
  onSubmit: (username: string, password: string) => void
}

export interface ICustomButton {
  // button: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: 'small' | 'medium' | 'large'
  to?: string
  children: ReactNode
  [key: string]: any
}

export interface ILogout {
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
