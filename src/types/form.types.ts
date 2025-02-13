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
  size?: 'small' | 'large'
  to?: string
  children: ReactNode
  [key: string]: any
}

export interface ITextInput {
  className?: string
  id?: string
  name?: string
  type: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  [key: string]: any
}

export interface IFormButton {
  className?: string
  children?: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  [key: string]: any
}

export interface ILinkButton {
  className?: string
  to: string
  children?: ReactNode
  [key: string]: any
}
