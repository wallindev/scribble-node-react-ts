import type { CSSProperties, Dispatch, MouseEventHandler, ReactNode, RefObject, SetStateAction } from 'react'
import { To } from 'react-router-dom'

/*
 * Enums
 *
 */

export enum Mode {
  Show,
  Edit,
  New
}

export enum Theme {
  Default,
  Red,
  Orange,
  Yellow,
  Green,
  Blue,
  Indigo,
  Violet,
  Pink,
  Purple,
  Gray
}

export enum LinkType {
  Nav,
  Button,
  Text
}

export enum TokenType {
  Auth,
  Verify
}

export enum MessageType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Reset = 'reset'
}

export enum Color {
  Green = 'bg-green-700',
  Blue = 'bg-blue-700',
  Yellow = 'bg-yellow-700',
  Red = 'bg-red-700',
  Reset =  'bg-transparent'
}

/*
 * Types
 *
 */

export type TColor = {
  [key: string]: string
}
// export type TColor = {
//   success: string
//   info: string
//   warning: string
//   error: string
// }

export type TArticle = {
  id?: number | null
  title: string
  content: string
  created: string | null
  modified: string
  userId: number | null
}

export type TUser = {
  id?: number | null
  firstName: string
  lastName: string
  email: string
  password?: string | null
  passwordConfirm?: string | null
  authToken?: string | null
  created: string | null
  modified: string
}

export type TFlashMessage = {
  message: string
  type: string
  visible: boolean
}

/*
 * Interfaces (props)
 *
 */

export interface IMainNav {
  wrapperRef: RefObject<HTMLDivElement | null>
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>
  flashMessage: TFlashMessage
  subNavOpen?: boolean
  setSubNavOpen?: Dispatch<SetStateAction<boolean>>
}

export interface IFlashMessage {
  flashMessage: TFlashMessage
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>
}

export interface IFooter {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

export interface IGlobal {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
  loading: boolean
  setLoading?: Dispatch<SetStateAction<boolean>>
  flashMessage: TFlashMessage
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>
  wrapperRef: RefObject<HTMLDivElement | null>
}

export interface ILayout extends IGlobal {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
  loading: boolean
  setLoading?: Dispatch<SetStateAction<boolean>>
  flashMessage: TFlashMessage
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>
  wrapperRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}

export type ILoadText = {
  loading?: boolean
  defaultText?: string
}

export interface IDelayedLink {
  wrapperRef: RefObject<HTMLDivElement | null>
  linkType?: LinkType
  delay?: number
  className?: string
  buttonType?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  // onClick?: () => void
  size?: 'small' | 'medium' | 'large'
  style?: CSSProperties
  to: To
  children: ReactNode
  [key: string]: any
}

export interface ITextLink {
  className?: string
  to: To
  children?: ReactNode
  style?: CSSProperties
  [key: string]: any
}

export interface IThemeSelector {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}
