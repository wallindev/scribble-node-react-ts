import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { /* HttpStatusCode,  */isAxiosError } from 'axios'
import type { FC, JSX } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import CustomButton from './shared/CustomButton'
import FlashMessage from './shared/FlashMessage'
import TextLink from './shared/TextLink'
import type { TArticle, IGlobal, TFlashMessage } from '../types/general.types'
import { consoleError, dismissFlashMessage, getToken, localDateStr, logout } from '../utils/functions'
import { defaultFlashMessage } from '../utils/defaults'

const Articles: FC<IGlobal> = ({ loading, setLoading, theme, setTheme }): JSX.Element => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<TArticle[]>([])
  const [flashMessage, setFlashMessage] = useState<TFlashMessage>(defaultFlashMessage)

  // Load articles
  useEffect(() => {
    !(async (): Promise<void> => {
      setLoading!(true)
      let error
      try {
        const response: AxiosResponse = await axios.get('/articles', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        setArticles(response.data)
      } catch (e) {
        if (isAxiosError(e)) {
          error = e as AxiosError
          console.error(`Error fetching articles: ${error}`)
          const nestedError = (error.response as AxiosResponse)?.data?.error
          // console.log('error.name:', nestedError.name)
          // console.log('error.message:', nestedError.message)
          // console.log('error.stack:', nestedError.stack)
          // console.error('nestedError:', nestedError)
          if (nestedError?.name === 'TokenExpiredError') {
            // console.error('[Nested] TokenExpiredError: Token expired:', nestedError || '')
            console.log('nestedError.name:', nestedError.name)
            console.log('nestedError.message:', nestedError.message)
            console.log('nestedError.expiredAt:', localDateStr(nestedError.expiredAt))
            setFlashMessage({
              message: 'Session has expired. Logging out...',
              type: 'warning',
              visible: true,
            })
            setTimeout(() => {
              logout()
              setFlashMessage(defaultFlashMessage)
              navigate('/')
            }, 3000)
          } else if (nestedError?.name === 'JsonWebTokenError') {
            console.error('[Nested] JsonWebTokenError: Token malformed:', nestedError || '')
            setFlashMessage({
              message: 'Session verification failed. Try logging out and in again.',
              type: 'warning',
              visible: true,
            })
          } else {
            console.error('Unknown error:', nestedError || '')
            setFlashMessage({
              message: 'Session unexpectedly ended. Try logging out and in again.',
              type: 'warning',
              visible: true,
            })
          }
        }
      } finally {
        // To mock slow network
        // setTimeout(() => {
          setLoading!(false)
        // }, 5000)
      }
    })()
  }, [articles.length])

  const deleteArticle = async (artcl: TArticle): Promise<void> => {
    if (confirm(`Do you really want to delete article '${artcl.title}'`)) {
      let error
      try {
        const response: AxiosResponse = await axios.delete(`${'/articles'}/${artcl.id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        })
        setArticles(response.data)
      } catch (e) {
        if (isAxiosError(e))  {
          error = e as AxiosError
          consoleError(error)
          console.error('Error deleting article:', error)
          setFlashMessage({
            message: `Error updating article:<br />${error}`,
            type: 'error',
            visible: true,
          })
        } else {
          error = e
          console.error("Error deleting article:\n", error)
          setFlashMessage({
            message: `Error deleting article:<br />${error}`,
            type: 'error',
            visible: true,
          })
        }
      }

      if (!error) {
        setFlashMessage({
          message: 'Article removed successfully',
          type: 'success',
          visible: true,
        })
        // To mock slow network
        setTimeout(() => {
          setFlashMessage(defaultFlashMessage)
          // setLoading!(false)
        }, 3000)
      }
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      {flashMessage.visible && (
        <FlashMessage
          message={flashMessage.message}
          type={flashMessage.type}
          onDismiss={() => dismissFlashMessage(flashMessage, setFlashMessage)}
        />
      )}
      <div className="mt-0 m-2 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Articles</h1>
        <CustomButton className="my-2" onClick={() => navigate('/articles/new')}>New Article &raquo;</CustomButton>
        <div className="m-2">
          {articles.map((article) => (
            <div className="my-2 flex flex-row justify-between items-center border-0 border-b-1" key={article.id}>
              <div className="my-1" key={`t${article.id}`}>
                <TextLink className="text-xl" to={`/articles/${article.id}`} style={{ fontSize: '20px' }}>{article.title}</TextLink>
              </div>
              <div className="my-1" key={`d${article.id}`}>
                <CustomButton onClick={() => deleteArticle(article)}>Delete</CustomButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Articles
