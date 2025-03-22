import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { FC, JSX } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import DelayedLink from './shared/DelayedLink'
import { LinkType, TokenType } from '../types/general.types'
import type { IGlobal } from '../types/general.types'
import { consoleError, handleHttpError, login, scrollSmoothlyToTop } from '../utils/functions'
import { defaultFlashMessage } from '../utils/defaults'

const Verify: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const params = useParams<{ verifyToken: string }>()

  useEffect(() => {
    if (params.verifyToken) {
      !(async () => {
        let httpError, tokenData
        try {
          setLoading!(true)
          scrollSmoothlyToTop()
          setFlashMessage({
            message: 'Verifying email address...',
            type: 'success',
            visible: true,
          })
          const response: AxiosResponse = await axios.get(`/verify?token=${params.verifyToken}`)
          if (response.status === HttpStatusCode.Ok && response.data) {
            const { userId, authToken, issued, expires } = response.data
            // console.log('userId:', userId)
            // console.log('authToken:', authToken)
            // console.log('issued:', issued)
            // console.log('expires:', expires)
            if (!userId || !authToken || !issued || !expires) throw new Error("Missing Response data content")
            tokenData = JSON.stringify({ userId, authToken, issued, expires })
          }
        } catch (error) {
          handleHttpError(httpError, error, setFlashMessage, defaultFlashMessage, TokenType.Verify, navigate)
        } finally {
          setLoading!(false)
        }
        if (!httpError && tokenData) {
          setTimeout(() => {
            setFlashMessage(defaultFlashMessage)
          }, 2900)
          setTimeout(() => {
            setFlashMessage({
              message: 'Email verification successful! Logging in...',
              type: 'success',
              visible: true,
            })
          }, 3000)
          setTimeout(() => {
            // console.log('tokenData:', tokenData)
            // console.log('JSON.parse(tokenData):', JSON.parse(tokenData))
            login(tokenData)
            navigate('/home')
          }, 6000)
        }
      })()
    }
  }, [])

  const resendVerificationLink = async () => {
    let error, userId
    try {
      setLoading!(true)
      scrollSmoothlyToTop()
      setFlashMessage({
        message: 'Sending verification email...',
        type: 'success',
        visible: true,
      })
      const response: AxiosResponse = await axios.post('/sendVerificationLink', { /* email */ })
      if (response.status === HttpStatusCode.Created && response.data) {
        userId = response.data.userId
      }
    } catch (e) {
      if (isAxiosError(e)) {
        error = e as AxiosError
        consoleError(error)
        setFlashMessage({
          message: 'An error occured trying to register',
          type: 'error',
          visible: true,
        })
      } else {
        console.error("Error trying to register:\n", error)
        setFlashMessage({
          message: `Error trying to register:<br />${error}`,
          type: 'error',
          visible: true,
        })
      }
    } finally {
      setLoading!(false)
    }
    if (!error && userId) {
      setFlashMessage(defaultFlashMessage)
      setTimeout(() => {
        setFlashMessage({
          message: 'Registration successful! Please check your inbox for an email verification link.',
          type: 'success',
          visible: true,
        })
      }, 50)
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <div>
        <h3 className="text-2xl font-bold mb-4">Email Verification</h3>
        <div>
          <p className="mt-4"><DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} onClick={resendVerificationLink} className="ml-1">Re-send verification link</DelayedLink></p>
        </div>
      </div>
    </Layout>
  )
}

export default Verify
