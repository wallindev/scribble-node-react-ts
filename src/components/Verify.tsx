import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { FC, JSX } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import FlashMessage from './shared/FlashMessage'
import type { IGlobal, TFlashMessage } from '../types/general.types'
import { consoleError, dismissFlashMessage, scrollSmoothlyToTop } from '../utils/functions'
import { defaultFlashMessage } from '../utils/defaults'
import { login } from '../utils/functions'

const Verify: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const params = useParams<{ verifyToken: string }>()
  const [flashMessage, setFlashMessage] = useState<TFlashMessage>(defaultFlashMessage)

  useEffect(() => {
    if (params.verifyToken) {
      !(async () => {
        let error, tokenData
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
            console.log('userId:', userId)
            console.log('authToken:', authToken)
            console.log('issued:', issued)
            console.log('expires:', expires)
            tokenData = JSON.stringify({ userId, authToken, issued, expires })
          }
        } catch (e) {
          if (isAxiosError(e)) {
            error = e as AxiosError
            consoleError(error)
            setFlashMessage({
              message: 'An error occured trying to verify',
              type: 'error',
              visible: true,
            })
          } else {
            console.error("Error trying to verify:\n", error)
            setFlashMessage({
              message: `Error trying to verify:<br />${error}`,
              type: 'error',
              visible: true,
            })
          }
        } finally {
          setLoading!(false)
        }
        if (!error && tokenData) {
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
            console.log('tokenData:', tokenData)
            console.log('JSON.parse(tokenData):', JSON.parse(tokenData))
            login(tokenData)
            navigate('/home')
          }, 6000)
        }
      })()
    }
  }, [])

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} wrapperRef={wrapperRef}>
      <div>
        {flashMessage.visible ? <FlashMessage
            message={flashMessage.message}
            type={flashMessage.type}
            onDismiss={() => dismissFlashMessage(flashMessage, setFlashMessage)}
          /> : <div className="h-8 mb-2"></div>}
        <h3 className="text-2xl font-bold mb-4">Email Verification</h3>
      </div>
    </Layout>
  )
}

export default Verify
