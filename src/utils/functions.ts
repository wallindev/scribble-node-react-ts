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

export const scrollSmoothlyToTop = (): void => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })

export const setElementText = (element: HTMLDivElement, text: string): void => { element.innerText = text }

export const selectElementText = (element: HTMLDivElement | HTMLInputElement, text: string): void => {
  if ((element as HTMLDivElement)?.innerText === text || (element as HTMLInputElement)?.value === text) {
    const range: Range = document.createRange()
    range.selectNodeContents(element)
    // const selection = window.getSelection()
    const selection: Selection = document.getSelection() as Selection
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

export const replaceNewlinesWithBr = (text: string): string => text.replace(/\r\n|\r|\n/g, '<br />')

export const dismissFlashMessage = (
  flashMessage: TFlashMessage,
  setFlashMessage: Dispatch<SetStateAction<TFlashMessage>>,
) => {
  setFlashMessage({ ...flashMessage, visible: false })
}

export const login = (tokenData: string): void => setTokenData(tokenData)

export const logout = (): void => removeTokenData()

export const getTokenData = (): string | null => localStorage.getItem('tokenData')

export const setTokenData = (tokenData: string): void => localStorage.setItem('tokenData', tokenData)

export const removeTokenData = (): void => localStorage.removeItem('tokenData')

export const getUserId = (): number | null => {
  const tokenData = getTokenData()
  if (!tokenData) return null
  const tokenDataJson = JSON.parse(tokenData)
  if (!Number.isInteger(Number(tokenDataJson.userId))) return null
  // console.log('tokenData:', tokenData)
  // console.log('tokenDataJson:', tokenDataJson)
  // console.log('tokenDataJson.userId:', tokenDataJson.userId)
  return Number(tokenDataJson.userId)
}

export const hasUserId = (): boolean => getUserId() !== null

export const getAuthToken = (): string | null => {
  const tokenData = getTokenData()
  if (!tokenData) return null
  const tokenDataJson = JSON.parse(tokenData)
  return tokenDataJson.authToken || null
}

export const hasAuthToken = (): boolean => getAuthToken() !== null

export const authTokenValid = (): boolean => {
  const tokenData = getTokenData()
  if (!tokenData) return false
  const tokenDataJson = JSON.parse(tokenData)
  const tokenTimestamp = tokenDataJson.expires
  if (!tokenTimestamp) return false
  // console.log('tokenTimestamp:', tokenTimestamp)
  // console.log('Date.now():', Date.now())
  // console.log('Date.now() <= tokenTimestamp:', Date.now() <= tokenTimestamp)
  return Date.now() <= tokenTimestamp
}

// Helper function to check authentication status
// TODO: Change this to server-only cookie
export const isAuthenticated = (): boolean => hasUserId() && hasAuthToken() && authTokenValid()

export const localDateStr = (dateStr?: string | number | Date | null): string => {
  const date : Date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
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
