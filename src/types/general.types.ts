import type { CSSProperties, Dispatch, MouseEventHandler, ReactNode, RefObject, SetStateAction } from 'react'

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

/*
 * Types
 *
 */
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
  type: 'success' | 'info' | 'warning' | 'error'
  visible: boolean
}

/*
 * Interfaces (props)
 *
 */

export interface IMainNav {
  wrapperRef: RefObject<HTMLDivElement | null>
  subNavOpen?: boolean
  setSubNavOpen?: Dispatch<SetStateAction<boolean>>
}

export interface IFlashMessage {
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
  onDismiss: MouseEventHandler<HTMLButtonElement> // () => void
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
  className?: string | (({ isActive }: { isActive: any }) => string)
  buttonType?: 'button' | 'submit' | 'reset'
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: 'small' | 'medium' | 'large'
  style?: CSSProperties
  to?: string
  children: ReactNode
  [key: string]: any
}

export interface ITextLink {
  className? : string
  to: string
  children?: ReactNode
  style?: CSSProperties
  [key: string]: any
}

export interface IThemeSelector {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}
