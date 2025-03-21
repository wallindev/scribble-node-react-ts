import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { ChangeEvent, FC, JSX, KeyboardEvent, KeyboardEventHandler } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextInput from './shared/TextInput'
import DelayedLink from './shared/DelayedLink'
import { LinkType } from '../types/general.types'
import type { IGlobal } from '../types/general.types'
import { consoleError, login, scrollSmoothlyToTop } from '../utils/functions'
import { defaultFlashMessage } from '../utils/defaults'

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
        const { userId, authToken, issued, expires } = response.data
        // console.log('userId:', userId)
        // console.log('authToken:', authToken)
        // console.log('issued:', issued)
        // console.log('expires:', expires)
        if (!userId || !authToken || !issued || !expires) throw new Error("Missing Response data content")
        tokenData = JSON.stringify({ userId, authToken, issued, expires })
        // console.log('tokenData:', tokenData)
        // console.log('JSON.parse(tokenData):', JSON.parse(tokenData))
        login(tokenData)
      }
    } catch (error) {
      if (isAxiosError(error))  {
        httpError = error as AxiosError
        consoleError(httpError)
        setFlashMessage({
          message: 'An error occured trying to log in',
          type: 'error',
          visible: true,
        })
      } else {
        httpError = error as Error
        console.error("Error trying to log in:", error)
        setFlashMessage({
          message: `Error trying to log in: ${error}`,
          type: 'error',
          visible: true,
        })
      }
    }
    if (!httpError && tokenData) {
      scrollSmoothlyToTop()
      setFlashMessage({
        message: 'Login successful! Redirecting...',
        type: 'success',
        visible: true,
      })
      setTimeout(() => {
        navigate('/home')
        setFlashMessage(defaultFlashMessage)
      }, 3000)
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
          <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} className="max-sm:flex-1/2 mr-0.5 sm:mr-1" buttonType="button" to="/">&laquo; Cancel</DelayedLink>
          <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} className="max-sm:flex-1/2 ml-0.5 sm:ml-1" type="button" onClick={handleLogin}>Login</DelayedLink>
        </div>
      </div>
    </Layout>
  )
}

export default Login
