import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { ChangeEvent, FC, JSX, KeyboardEvent, KeyboardEventHandler, RefObject } from 'react'
import type { AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextInput from './shared/TextInput'
import CustomButton from './shared/CustomButton'
import { LinkType, TokenType } from '../types/general.types'
import { handleHttpError, hideFlashMessage } from '../utils/functions'
import type { IGlobal } from '../types/general.types'
import DelayedLink from './shared/DelayedLink'

const Register: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  const handleRegister = async () => {
    let httpError, userId
    try {
      setLoading!(true)
      setFlashMessage({
        message: 'Sending verification email...',
        type: 'success',
        visible: true,
      })
      const response: AxiosResponse = await axios.post('/register', { firstName, lastName, email, password, passwordConfirm })
      if (response.status === HttpStatusCode.Created && response.data) {
        userId = response.data.userId
      }
    } catch (error) {
      if (isAxiosError(error) && (error.response as AxiosResponse).status === 409) {
        setFlashMessage({
          message: 'Email address is already registered',
          type: 'error',
          visible: true,
        })
      } else {
      httpError = handleHttpError(error, wrapperRef as RefObject<HTMLDivElement>, flashMessage, setFlashMessage, TokenType.Verify, navigate)
      }
    } finally {
      setLoading!(false)
    }
    if (!httpError && userId) {
      hideFlashMessage(flashMessage, setFlashMessage)
      setTimeout(() => {
        setFlashMessage({
          message: 'Registration successful! Please check your inbox for an email verification link.',
          type: 'success',
          visible: true,
        })
      }, 1000)
      setTimeout(() => {
        resetForm()
      }, 1500)
    }
  }

  const keyDownOnElement: KeyboardEventHandler = (key: KeyboardEvent<HTMLInputElement>) => {
    if (key.code.toUpperCase() === 'ENTER' || key.code.toUpperCase() === 'NUMPADENTER') {
      key.preventDefault()
      handleRegister()
    }
  }

  const resetForm = (): void => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <h3 className="text-2xl font-bold mb-4">Register</h3>
      <div className="flex flex-col sm:items-start mb-4">
        <label htmlFor="firstName" className="p-1">First Name</label>
        <TextInput
          id="firstName"
          name="firstName"
          type="text"
          value={firstName}
          className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
          onKeyDown={keyDownOnElement}
        />
        <label htmlFor="lastName" className="p-1">Last Name</label>
        <TextInput
          id="lastName"
          name="lastName"
          type="text"
          value={lastName}
          className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
          onKeyDown={keyDownOnElement}
        />
        <label htmlFor="email" className="p-1">Email</label>
        <TextInput
          id="email"
          name="email"
          type="email"
          value={email}
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
        <label htmlFor="passwordConfirm" className="p-1">Confirm Password</label>
        <TextInput
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          value={passwordConfirm}
          className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPasswordConfirm(e.target.value)}
          onKeyDown={keyDownOnElement}
        />
        <div className="flex flex-row sm:items-start mt-4">
          <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} className="max-sm:flex-1/2 mr-0.5 sm:mr-1" to="/">&laquo; Cancel</DelayedLink>
          <CustomButton className="max-sm:flex-1/2 ml-0.5 sm:ml-1" onClick={handleRegister} size="large">Register</CustomButton>
        </div>
      </div>
    </Layout>
  )
}

export default Register
