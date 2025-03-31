import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { FC, JSX, MouseEvent, RefObject } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextLink from './shared/TextLink'
import { TokenType } from '../types/general.types'
import { consoleError, getUserEmail, getUserId, handleHttpError, login } from '../utils/functions'
import type { IGlobal } from '../types/general.types'

const Verify: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const params = useParams<{ verifyToken: string }>()

  useEffect(() => {
    if (params.verifyToken) {
      !(async () => {
        let httpError, tokenData
        try {
          setLoading!(true)
          setFlashMessage({
            message: 'Verifying email address...',
            type: 'success',
            visible: true,
          })
          const response: AxiosResponse = await axios.get(`/verify?token=${params.verifyToken}`)
          if (response.status === HttpStatusCode.Ok && response.data) {
            const { userId, email, authToken, issued, expires } = response.data
            if (!userId || !email || !authToken || !issued || !expires) throw new Error("Missing Response data content")
            tokenData = JSON.stringify({ userId, email, authToken, issued, expires })
          }
        } catch (error) {
          httpError = handleHttpError(error, wrapperRef as RefObject<HTMLDivElement>, flashMessage, setFlashMessage, TokenType.Verify, navigate)
        } finally {
          setLoading!(false)
        }
        if (!httpError && tokenData) {
          setTimeout(() => {
            setFlashMessage({ ...flashMessage, visible: false })
          }, 2900)
          setTimeout(() => {
            setFlashMessage({
              message: 'Email verification successful! Logging in...',
              type: 'success',
              visible: true,
            })
          }, 3000)
          setTimeout(() => {
            login(tokenData)
            navigate('/home')
            setFlashMessage({ ...flashMessage, visible: false })
          }, 6000)
        }
      })()
    }
  }, [])

  const resendVerificationLink = async (e: MouseEvent<HTMLAnchorElement>): Promise<void> => {
    e.preventDefault()
    let httpError, userId, email
    try {
      setLoading!(true)
      setFlashMessage({ ...flashMessage, visible: false })
      setTimeout(() => {
        setFlashMessage({
          message: 'Resending verification email...',
          type: 'success',
          visible: true,
        })
      }, 50)
      const response: AxiosResponse = await axios.post('/register?reSend', { userId: getUserId(), email: getUserEmail() })
      if (response.status === HttpStatusCode.Ok && response.data) {
        userId = response.data.userId
        email = response.data.email
      }
    } catch (error) {
      // httpError = handleHttpError(error, wrapperRef as RefObject<HTMLDivElement>, flashMessage, setFlashMessage, TokenType.Verify, navigate)
      if (isAxiosError(error)) {
        httpError = error as AxiosError
        consoleError(httpError)
        setFlashMessage({
          message: 'An error occured trying to resend verification email',
          type: 'error',
          visible: true,
        })
      } else {
        console.error("Error trying to resend verification email:\n", httpError)
        setFlashMessage({
          message: `Error trying to resend verification email:<br />${httpError}`,
          type: 'error',
          visible: true,
        })
      }
    } finally {
      setLoading!(false)
    }
    if (!httpError && userId && email) {
      setFlashMessage({ ...flashMessage, visible: false })
      setTimeout(() => {
        setFlashMessage({
          message: 'Email sent successfully! Please check your inbox again for a new email verification link.',
          type: 'success',
          visible: true,
        })
      }, 50)
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <h3 className="text-2xl font-bold mb-4">Email Verification</h3>
      <div className="mt-4"><TextLink to={location.href} onClick={resendVerificationLink} className="ml-1">Re-send verification link</TextLink></div>
    </Layout>
  )
}

export default Verify
