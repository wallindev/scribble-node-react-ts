// import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { TFlashMessage } from '../types/general.types'

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

export const selectElementText = (element: HTMLDivElement, text?: string): void => {
  if (element && element.innerText === text) {
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

// Helper function to check authentication status
export const isAuthenticated = (): boolean => {
  // TODO: Change this to localStorage.getItem('token')
  // when full authentication is implemented
  return localStorage.getItem('AUTHENTICATED') === 'true'
}

export const setAuth = (authenticated: boolean): void => {
  authenticated ? localStorage.setItem('AUTHENTICATED', 'true') : localStorage.removeItem('AUTHENTICATED')
}

export const localDateStr = (dateStr?: string | null): string => {
  const date = dateStr ? new Date(dateStr) : new Date()
  return date.toLocaleString("sv-SE", { timeZone: "CET" })
}