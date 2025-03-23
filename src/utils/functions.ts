// import { useState } from 'react'
import axios, { isAxiosError } from 'axios'
import type { Dispatch, SetStateAction } from 'react'
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { TFlashMessage, TokenType } from '../types/general.types'
import type { NavigateFunction } from 'react-router-dom'

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

export const getUserEmail = (): string | null => {
  const tokenData = getTokenData()
  if (!tokenData) return null
  const tokenDataJson = JSON.parse(tokenData)
  if (!tokenDataJson.userEmail) return null
  return tokenDataJson.userEmail
}

export const hasUserEmail = (): boolean => getUserEmail() !== null

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
export const isAuthenticated = (setAuth: Dispatch<SetStateAction<boolean>>, defaultRequestConfig?: AxiosRequestConfig | {}): boolean | void => {
  /*
   * Client authentication
   *
   */
  if (hasUserId() && hasAuthToken() && authTokenValid()) {
    setAuth(true)
  } else {
    setAuth(false)
  }

  /*
   * Server authentication
   *
   */
  /* // console.log('defaultRequestConfig:', defaultRequestConfig)
  if (!defaultRequestConfig) setAuth(false)

  axios.get('/token', defaultRequestConfig)
  .then(res => {
    // console.log('response:', res)
    if (!res.data?.authenticated) setAuth(false)
    setAuth(res.data.authenticated)
  })
  .catch(error => {
    let httpError
    setAuth(false)
    handleHttpError(httpError, error)
  }) */
}

export const localDateStr = (dateStr?: string | number | Date | null): string => {
  const date : Date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
}

export const handleHttpError = (httpError: any, error: any, setFlashMessage?: Dispatch<SetStateAction<TFlashMessage>>, defaultFlashMessage?: any, tokenType?: TokenType, navigate?: NavigateFunction) => {
  if (isAxiosError(error)) {
    httpError = error as AxiosError
    const nestedError = (httpError.response as AxiosResponse)?.data?.error
    if (nestedError) {
      console.log('nestedError.name:', nestedError.name)
      console.log('nestedError.message:', nestedError.message)
      // console.log('nestedError.stack:', nestedError.stack)
      // console.error('nestedError:', nestedError)
      if (nestedError.name === 'TokenExpiredError') {
        console.error('[Nested] TokenExpiredError: Token expired:', nestedError)
        console.log('nestedError.expiredAt:', localDateStr(nestedError.expiredAt))
        if (setFlashMessage) {
          const expMsg = tokenType === TokenType.Auth ? 'Session has expired. Logging out...' : 'Email verification token has expired. Try re-sending the link.'
          setFlashMessage({
            message: expMsg,
            type: 'warning',
            visible: true,
          })
          if (tokenType === TokenType.Auth) {
            setTimeout(() => {
              logout()
              setFlashMessage(defaultFlashMessage)
              navigate!('/')
            }, 3000)
          }
        }
      } else if (nestedError.name === 'JsonWebTokenError') {
        console.error('[Nested] JsonWebTokenError: Token malformed:', nestedError)
        if (setFlashMessage) {
          const malMsg = tokenType === TokenType.Auth ? 'Session verification failed. Try logging out and in again.' : 'Email verification token is malformed. Make sure the verification link is not broken, or re-send link.'
          setFlashMessage({
            message: malMsg,
            type: 'warning',
            visible: true,
          })
        }
      } else {
        console.error('Unknown token error:', nestedError)
        if (setFlashMessage) {
          const unknownMsg = tokenType === TokenType.Auth ? 'Session unexpectedly ended. Try logging out and in again.' : 'Something went wrong during the email verification. Try re-sending the link.'
          setFlashMessage({
            message: unknownMsg,
            type: 'warning',
            visible: true,
          })
        }
      }
    } else {
      console.log('httpError.name:', httpError.name)
      console.log('httpError.message:', httpError.message)
      // console.log('httpError.stack:', httpError.stack)
      // console.error(`Http Error: ${httpError}`)
      // if (!setFlashMessage) console.error('error:', httpError)
      if (setFlashMessage) {
        const otherMsg = tokenType === TokenType.Auth ? 'Error trying to authorize user' : 'Error trying to verify email'
        console.error(`${otherMsg}:`, httpError)
        setFlashMessage({
          message: `${otherMsg}: ${httpError}`,
          type: 'error',
          visible: true,
        })
      }
    }
  } else {
    httpError = error as typeof error
    if (!setFlashMessage) {
      console.log('httpError.name:', httpError.name)
      console.log('httpError.message:', httpError.message)
      // console.log('httpError.stack:', httpError.stack)
      console.error('httpError:', httpError)
    }
    if (setFlashMessage) {
      const otherMsg = tokenType === TokenType.Auth ? 'Error trying to authorize user' : 'Error trying to verify email'
      console.error(`${otherMsg}:`, httpError)
      setFlashMessage({
        message: `${otherMsg}: ${httpError}`,
        type: 'error',
        visible: true,
      })
    }
  }
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
