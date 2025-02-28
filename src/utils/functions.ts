// import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { TFlashMessage } from '../types/general.types'
import { isAxiosError } from 'axios'
import type { AxiosError } from 'axios'

// Example of JSDoc
/**
 * @name setElementText
 * @param element @type HTMLDivElement
 * @param text @type string
 * @returns void
 */

/**
 * Functions
 *
 */
export const setElementText = (element: HTMLDivElement, text: string) => element.innerText = text

export const selectElementText = (element: HTMLDivElement | HTMLInputElement, text?: string): void => {
  if (((element as HTMLDivElement) && (element as HTMLDivElement).innerText === text) ||
      ((element as HTMLInputElement) && (element as HTMLInputElement).value === text)) {
    const range = document.createRange()
    range.selectNodeContents(element)
    // const selection = window.getSelection()
    const selection = document.getSelection()
    selection!.removeAllRanges()
    selection!.addRange(range)
  }
}

export const replaceNewlinesWithBr = (text: string): string => {
  return text.replace(/\r\n|\r|\n/g, '<br />')
}

export const dismissFlashMessage = (
  flashMessage: TFlashMessage,
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>,
) => {
  setFlashMessage({ ...flashMessage, visible: false })
}

// Short-form of process.env.KEY
export const env = (key: string) => process.env[key]

// Helper function to check authentication status
export const isAuthenticated = (): boolean => {
  // TODO: Change this to localStorage.getItem('token')
  // when full authentication is implemented
  return localStorage.getItem('AUTHENTICATED') === 'true' && hasUserId()
}

export const login = (token: string, userId: number): void => {
  setAuth(true)
  setToken(token)
  setUserId(userId)
}

export const logout = (): void => {
  setAuth(false)
  removeToken()
  removeUserId()
}

export const setAuth = (authenticated: boolean): void => {
  authenticated ? localStorage.setItem('AUTHENTICATED', 'true') : localStorage.removeItem('AUTHENTICATED')
}

export const getUserId = (): number | null => {
  const userId: string | null = localStorage.getItem('userId')
  if (userId || Number.isInteger(Number(userId))) {
    return Number(userId)
  } else {
    return null
  }
}

export const hasUserId = (): boolean => {
  return localStorage.getItem('userId') !== null
}

export const setUserId = (userId: number): void => {
  localStorage.setItem('userId', userId.toString())
}

export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

export const removeToken = (): void => {
  localStorage.removeItem('token')
}

export const removeUserId = (): void => {
  localStorage.removeItem('userId')
}

export const localDateStr = (dateStr?: string | null): string => {
  const date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString("sv-SE", { timeZone: "CET" })
}

// console.log with console.error styling
export const consoleError = (errorObj: any): void => {
  const style: string = `display: flex;
align-items: center;
padding: 5px 10px;
background: #4B2F36;
color: #F4ABC9;
border-top: 1px solid #743E4C;
border-bottom: 1px solid #743E4C;`.replace(/\n/g, ' ')
  if (isAxiosError(errorObj)) {
    const error: AxiosError = errorObj as AxiosError
    console.log(`%c${error.name}: ${error.message}`, style)
  } else {
    console.log(`%c${errorObj}`, style)
  }
  // const errorData = { Message: error.message, Name: error.name, Code: error.code, Status: error.status }
  // console.error('Message:', error.message)
  // console.error('Name:', error.name)
  // console.error('Code:', error.code)
  // console.error('Status:', error.status)
  // console.table(errorData)
}
