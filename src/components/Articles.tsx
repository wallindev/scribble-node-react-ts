import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { FC, JSX } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import CustomButton from './shared/CustomButton'
import TextLink from './shared/TextLink'
import { TokenType } from '../types/general.types'
import type { TArticle, IGlobal } from '../types/general.types'
import { consoleError, handleHttpError } from '../utils/functions'
import { defaultFlashMessage, defaultRequestConfig } from '../utils/defaults'

const Articles: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<TArticle[]>([])

  // Load articles
  useEffect(() => {
    !(async (): Promise<void> => {
      setLoading!(true)
      let httpError
      try {
        const response: AxiosResponse = await axios.get('/articles', defaultRequestConfig)
        if (response.status === HttpStatusCode.Ok && response.data) {
          setArticles(response.data)
        }
      } catch (error) {
        httpError = handleHttpError(error, setFlashMessage, defaultFlashMessage, TokenType.Auth, navigate)
      } finally {
        // To mock slow network
        // setTimeout(() => {
          setLoading!(false)
        // }, 5000)
      }
      if (!httpError/*  && articles|response.data etc */) {
        // If everything went well, do this
      }
    })()
  }, [articles.length])

  const deleteArticle = async (artcl: TArticle): Promise<void> => {
    if (confirm(`Do you really want to delete article '${artcl.title}'`)) {
      let error
      try {
        const response: AxiosResponse = await axios.delete(`${'/articles'}/${artcl.id}`, defaultRequestConfig)
        if (response.status === HttpStatusCode.Ok && response.data) {
          setArticles(response.data)
        }
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
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
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
    </Layout>
  )
}

export default Articles
