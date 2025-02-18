import type { CSSProperties, Dispatch, MouseEventHandler, ReactNode, SetStateAction } from 'react'

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

/*
 * Types
 *
 */
export type TArticle = {
  id?: number | string | null
  title: string
  content: string
  created?: string | null
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
}

export interface ILayout extends IGlobal {
  children: ReactNode
}

export type ILoadText = {
  loading?: boolean
  defaultText?: string
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
