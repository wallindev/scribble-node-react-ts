import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { HttpStatusCode } from 'axios'
import type { ChangeEvent, FC, JSX, KeyboardEvent, KeyboardEventHandler, RefObject } from 'react'
import type { AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextInput from './shared/TextInput'
import DelayedLink from './shared/DelayedLink'
import CustomButton from './shared/CustomButton'
import { LinkType, TokenType } from '../types/general.types'
import { fadeOutAndNavigate, handleHttpError, login } from '../utils/functions'
import { STANDARD_DELAY } from '../utils/constants'
import type { IGlobal } from '../types/general.types'

const Login: FC<IGlobal> = ({ loading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const inputEmailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    (inputEmailRef.current as HTMLInputElement).focus()
  }, [])

  const handleLogin = async () => {
    let httpError, tokenData
    try {
      const response: AxiosResponse = await axios.post('/login', { email, password })
      if (response.status === HttpStatusCode.Ok && response.data) {
        const { userId, email, authToken, issued, expires } = response.data
        if (!userId || !email || !authToken || !issued || !expires) throw new Error("Missing Response data content")
        tokenData = JSON.stringify({ userId, email, authToken, issued, expires })
      }
    } catch (error) {
      httpError = handleHttpError(error, wrapperRef as RefObject<HTMLDivElement>, flashMessage, setFlashMessage, TokenType.Auth, navigate)
      // if (isAxiosError(error))  {
      //   httpError = error as AxiosError
      //   consoleError(httpError)
      //   setFlashMessage({
      //     message: 'An error occured trying to log in',
      //     type: 'error',
      //     visible: true,
      //   })
      // } else {
      //   httpError = error as Error
      //   console.error("Error trying to log in:", error)
      //   setFlashMessage({
      //     message: `Error trying to log in: ${error}`,
      //     type: 'error',
      //     visible: true,
      //   })
      // }
    }
    if (!httpError && tokenData) {
      setFlashMessage({
        message: 'Login successful! Redirecting...',
        type: 'success',
        visible: true,
      })
      // Initiate fade-out effect on wrapper div
      fadeOutAndNavigate(wrapperRef as RefObject<HTMLDivElement>, '/home', navigate, STANDARD_DELAY, flashMessage, setFlashMessage)
      setTimeout(() => {
        login(tokenData)
      }, STANDARD_DELAY - 500)
    }
  }

  const keyDownOnElement: KeyboardEventHandler = (key: KeyboardEvent<HTMLInputElement>) => {
    if (key.code.toUpperCase() === 'ENTER' || key.code.toUpperCase() === 'NUMPADENTER') {
      key.preventDefault()
      handleLogin()
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <h3 className="text-2xl font-bold mb-4">Login</h3>
      <div className="flex flex-col sm:items-start mb-4">
        <label htmlFor="email" className="p-1">Email</label>
        <TextInput
          id="email"
          name="email"
          type="email"
          value={email}
          ref={inputEmailRef}
          className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          onKeyDown={keyDownOnElement}
        />
        <label htmlFor="password" className="p-1">Password</label>
        <TextInput
          id="password"
          name="password"
          type="password"
          value={password}
          className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          onKeyDown={keyDownOnElement}
        />
        <div className="flex flex-row sm:items-start mt-4">
          <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} className="max-sm:flex-1/2 mr-0.5 sm:mr-1" to="/">&laquo; Cancel</DelayedLink>
          <CustomButton className="max-sm:flex-1/2 ml-0.5 sm:ml-1" onClick={handleLogin} size="large">Login</CustomButton>
        </div>
      </div>
    </Layout>
  )
}

export default Login
