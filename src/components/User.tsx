import { useEffect, useRef, useState } from 'react'
import { useMatch, useNavigate, useSearchParams } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { ChangeEvent, FocusEvent, KeyboardEvent, FC, JSX, KeyboardEventHandler } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextInput from './shared/TextInput'
import CustomButton from './shared/CustomButton'
import FlashMessage from './shared/FlashMessage'
import { Mode } from '../types/general.types'
import type { IGlobal, Mode as TMode, TFlashMessage, TUser } from '../types/general.types'
import { consoleError, dismissFlashMessage, getUserId, localDateStr, selectElementText } from '../utils/functions'
import { defaultFlashMessage, defaultUser } from '../utils/defaults'

// import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'

const User: FC<IGlobal> = ({ loading, setLoading, theme, setTheme }): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams()
  const matchProfile = useMatch('/profile')
  const navigate = useNavigate()
  const [user, setUser] = useState<TUser>(defaultUser)
  const [flashMessage, setFlashMessage] = useState<TFlashMessage>(defaultFlashMessage)
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
    // TODO: Check if setFlashMessage works correctly
    userMode !== Mode.Edit && setFlashMessage(defaultFlashMessage)
    if (user.id) {
      !(async () => {
        setLoading!(true)
        try {
          const response: AxiosResponse = await axios.get(`/users/${user.id}`/* , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          } */)
          if (response.status === 200 && response.data) {
            // console.log('response.data:', response.data)
            setUser(response.data)
          }
        } catch (error) {
          if (isAxiosError(error))  {
            const axiosError = error as AxiosError
            consoleError(axiosError)
            switch (axiosError.status) {
              case HttpStatusCode.NotFound:
                setFlashMessage({
                  message: 'User not found',
                  type: 'error',
                  visible: true,
                })
                break
              default:
                setFlashMessage({
                  message: 'Something unexpected happened.',
                  type: 'error',
                  visible: true,
                })
            }
          } else {
            console.error(`Error fetching user:\n${error}`)
            setFlashMessage({
              message: `Error fetching user:<br />${error}`,
              type: 'error',
              visible: true,
            })
          }
        } finally {
          // To mock slow network
          // setTimeout(() => {
            setLoading!(false)
          // }, 5000)
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
    userMode === Mode.Edit ? updateUser(userData) : storeUser(userData)
  }

  // Update existing User (PATCH). Partial<User> because of the PATCH partial update.
  const updateUser = async (usr: Partial<TUser>) => {
    let error
    try {
      const response: AxiosResponse = await axios.patch(`/users/${usr.id}`, usr)
      setUser(response.data)
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
      // Remove querystring, so '/profile?edit' becomes '/profile'
      setSearchParams('', {preventScrollReset: true})
    }
  }

  // Store new User (POST)
  const storeUser = async (usr: TUser): Promise<void> => {
    return
    let error
    try {
      const response: AxiosResponse = await axios.post('/users', usr)
      // console.log('response.data:', response.data)
      setUser(response.data)
      navigate(`/profile`)
    } catch (error) {
      if (isAxiosError(error))  {
        const axiosError: AxiosError = error as AxiosError
        consoleError(axiosError)
        console.error('Error registering profile:', error)
        setFlashMessage({
          message: `Error registering profile:<br />${error}`,
          type: 'error',
          visible: true,
        })
      } else {
        console.error("Error registering profile:\n", error)
        setFlashMessage({
          message: `Error registering profile:<br />${error}`,
          type: 'error',
          visible: true,
        })
      }
    }
    if (!error) {
      setFlashMessage({
        message: 'Registered successfully',
        type: 'success',
        visible: true,
      })
      // TODO: is this needed?
      // Change mode to Show
      // setUserMode(Mode.Show)
    }
  }

  const keyDownOnElement: KeyboardEventHandler = (key: KeyboardEvent<HTMLInputElement>) => {
    if (key.code.toUpperCase() === 'ENTER' || key.code.toUpperCase() === 'NUMPADENTER') {
      key.preventDefault()
      saveUser()
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <div>
        {flashMessage.visible && (
          <FlashMessage
            message={flashMessage.message}
            type={flashMessage.type}
            onDismiss={() => dismissFlashMessage(flashMessage, setFlashMessage)}
          />
        )}
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
              <CustomButton onClick={() => navigate('?edit')}>Edit Profile</CustomButton>
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
              <CustomButton className="max-sm:flex-1/2 mr-0.5 sm:mr-1" type="button" onClick={() => userMode === Mode.Edit ? navigate('/profile') : navigate('/')}>&laquo; Cancel</CustomButton>
              <CustomButton className="max-sm:flex-1/2 ml-0.5 sm:ml-1" type="button" onClick={saveUser}>{userMode === Mode.Edit ? 'Update' : 'Register'}</CustomButton>
            </div>
          </>}
        </div>
      </div>
    </Layout>
  )
}

export default User
