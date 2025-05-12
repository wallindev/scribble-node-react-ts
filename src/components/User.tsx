import { useEffect, useRef, useState } from 'react'
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { ChangeEvent, FocusEvent, KeyboardEvent, FC, JSX, KeyboardEventHandler, RefObject } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextInput from './shared/TextInput'
import CustomButton from './shared/CustomButton'
import DelayedLink from './shared/DelayedLink'
import { LinkType, Mode, TokenType } from '../types/general.types'
import { consoleError, fadeOutAndNavigate, getAuthHeader, getUserId, handleHttpError, localDateStr, selectElementText } from '../utils/functions'
import { NAVIGATE_DELAY } from '../utils/constants'
import { defaultUser } from '../utils/defaults'
import type { IGlobal, Mode as TMode, TUser } from '../types/general.types'

const User: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const [searchParams, _setSearchParams] = useSearchParams()
  const matchProfile = useMatch('/profile')
  const navigate = useNavigate()
  const [user, setUser] = useState<TUser>(defaultUser)
  const [userMode, setUserMode] = useState<TMode>(Mode.Show)
  const inputFirstNameRef = useRef<HTMLInputElement>(null)
  const inputLastNameRef = useRef<HTMLInputElement>(null)
  const inputEmailRef = useRef<HTMLInputElement>(null)
  const inputPasswordRef = useRef<HTMLInputElement>(null)
  const inputPasswordConfirmRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // console.log('useEffect without dep')
    setUserMode(searchParams.has('edit') ? Mode.Edit : matchProfile ? Mode.Show : Mode.New)
  })

  // Fetch user id from local storage
  useEffect(() => {
    // console.log('useEffect with empty dep')
    if (!user.id) setUser({ ...user, id: getUserId() })
  }, [])

  useEffect(() => {
    if (user.id) {
      !(async () => {
        setLoading!(true)
        let httpError
        try {
          const response: AxiosResponse = await axios.get(`/users/${user.id}`, getAuthHeader())
          if (response.status === HttpStatusCode.Ok && response.data) {
            // console.log('response.data:', response.data)
            setUser(response.data)
          }
        } catch (error) {
          httpError = handleHttpError(error, wrapperRef as RefObject<HTMLDivElement>, flashMessage, setFlashMessage, TokenType.Auth, navigate)
          // if (isAxiosError(error))  {
          //   const axiosError = error as AxiosError
          //   consoleError(axiosError)
          //   switch (axiosError.status) {
          //     case HttpStatusCode.NotFound:
          //       setFlashMessage({
          //         message: 'User not found',
          //         type: 'error',
          //         visible: true,
          //       })
          //       break
          //     default:
          //       setFlashMessage({
          //         message: 'Something unexpected happened.',
          //         type: 'error',
          //         visible: true,
          //       })
          //   }
          // } else {
          //   console.error(`Error fetching user:\n${error}`)
          //   setFlashMessage({
          //     message: `Error fetching user:<br />${error}`,
          //     type: 'error',
          //     visible: true,
          //   })
          // }
        } finally {
          setLoading!(false)
        }
      })()
    }
    // TODO: searchParams.get or searchParams.has or something else?
  }, [user.id, searchParams.has('edit')])

  const saveUser = (): void => {
    const userData: TUser = {
      id: userMode === Mode.New ? undefined : user.id,
      firstName: (inputFirstNameRef.current as HTMLInputElement).value,
      lastName: (inputLastNameRef.current as HTMLInputElement).value,
      email: (inputEmailRef.current as HTMLInputElement).value,
      password: userMode === Mode.New ? (inputPasswordRef.current as HTMLInputElement).value : undefined,
      passwordConfirm: userMode === Mode.New ? (inputPasswordConfirmRef.current as HTMLInputElement).value : undefined,
      created: userMode === Mode.New ? localDateStr() : null,
      modified: localDateStr(),
    }
    // console.log('userData: ', userData)
    updateUser(userData)
    // userMode === Mode.Edit ? updateUser(userData) : storeUser(userData)
  }

  // Update existing User (PATCH). Partial<User> because of the PATCH partial update.
  const updateUser = async (usr: Partial<TUser>) => {
    let error
    try {
      const response: AxiosResponse = await axios.patch(`/users/${usr.id}`, usr, getAuthHeader())
      if (response.status === HttpStatusCode.Ok && response.data) {
        setUser(response.data)
      }
    } catch (e) {
      if (isAxiosError(e))  {
        error = e as AxiosError
        consoleError(error)
        setFlashMessage({
          message: 'An error occured when updating profile',
          type: 'error',
          visible: true,
        })
      } else {
        error = e
        console.error("Error updating profile:\n", error)
        setFlashMessage({
          message: `Error updating profile:<br />${error}`,
          type: 'error',
          visible: true,
        })
      }
    }
    if (!error) {
      setFlashMessage({
        message: 'Profile updated successfully',
        type: 'success',
        visible: true,
      })
      // Initiate fade-out effect on wrapper div
      fadeOutAndNavigate(wrapperRef as RefObject<HTMLDivElement>, '/profile', navigate, NAVIGATE_DELAY, flashMessage, setFlashMessage)
    }
  }

  const keyDownOnElement: KeyboardEventHandler = (key: KeyboardEvent<HTMLInputElement>) => {
    if (key.code.toUpperCase() === 'ENTER' || key.code.toUpperCase() === 'NUMPADENTER') {
      key.preventDefault()
      saveUser()
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <h3 className="text-2xl font-bold mb-4">{userMode === Mode.Edit ? 'Edit Profile' : userMode === Mode.Show ? 'Profile' : 'Register'}</h3>
      <div className="flex flex-col sm:items-start mb-4">
        {userMode === Mode.Show ? <>
          <div className="flex flex-row">
            <div className="text-xl py-2">{user.firstName}</div>
            <div className="text-xl py-2 pl-1">{user.lastName}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-xl py-2 mb-2">{user.email}</div>
          </div>
          <div className="mt-4">
            <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} to="?edit">Edit Profile</DelayedLink>
          </div>
        </> : <>
          <label htmlFor="firstName" className="p-1">First Name</label>
          <TextInput
            id="firstName"
            name="firstName"
            type="text"
            ref={inputFirstNameRef}
            value={user.firstName}
            className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, firstName: e.target.value })}
            onFocus={(e: FocusEvent<HTMLInputElement>) => selectElementText(e.target, e.target.value)}
            onKeyDown={keyDownOnElement}
          />
          <label htmlFor="lastName" className="p-1">Last Name</label>
          <TextInput
            id="lastName"
            name="lastName"
            type="text"
            ref={inputLastNameRef}
            value={user.lastName}
            className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 text-xl mb-4 border-0 outline-0"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, lastName: e.target.value })}
            onFocus={(e: FocusEvent<HTMLInputElement>) => selectElementText(e.target, e.target.value)}
            onKeyDown={keyDownOnElement}
          />
          <label htmlFor="email" className="p-1">Email</label>
          <TextInput
            id="email"
            name="email"
            type="email"
            ref={inputEmailRef}
            value={user.email}
            className={`${userMode !== Mode.New ? 'w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 ' : ''}text-xl mb-4 bg-main-content-bg text-text`}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUser({ ...user, email: e.target.value })}
            onKeyDown={keyDownOnElement}
          />
          {userMode === Mode.New && <>
            <label htmlFor="password" className="p-1">Password</label>
            <TextInput
              id="password"
              name="password"
              type="password"
              ref={inputPasswordRef}
              className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 ' : ''}block text-xl mb-4"
              onKeyDown={keyDownOnElement}
            />
            <label htmlFor="passwordConfirm" className="p-1">Confirm Password</label>
            <TextInput
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              ref={inputPasswordConfirmRef}
              className="w-full sm:w-8/10 inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 ' : ''}block text-xl mb-4"
              onKeyDown={keyDownOnElement}
            />
          </>}
          <div className="flex flex-row sm:items-start mt-4">
            <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} className="max-sm:flex-1/2 mr-0.5 sm:mr-1" to={userMode === Mode.Edit ? '/profile' : '/'}>&laquo; Cancel</DelayedLink>
            {/* <CustomButton className="max-sm:flex-1/2 mr-0.5 sm:mr-1" type="button" onClick={() => userMode === Mode.Edit ? navigate('/profile') : navigate('/')}>&laquo; Cancel</CustomButton> */}
            <CustomButton className="max-sm:flex-1/2 ml-0.5 sm:ml-1" type="button" onClick={saveUser} size="large">{userMode === Mode.Edit ? 'Update' : 'Register'}</CustomButton>
          </div>
        </>}
      </div>
    </Layout>
  )
}

export default User
