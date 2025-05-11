import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { FC, JSX, RefObject } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import CustomButton from './shared/CustomButton'
import DelayedLink from './shared/DelayedLink'
import { LinkType, TokenType } from '../types/general.types'
import { consoleError, getAuthHeader, handleHttpError, hideFlashMessage } from '../utils/functions'
import { NAVIGATE_DELAY } from '../utils/constants'
import type { TArticle, IGlobal } from '../types/general.types'

const Articles: FC<IGlobal> = ({ loading, setLoading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<TArticle[]>([])

  // Load articles
  useEffect(() => {
    !(async (): Promise<void> => {
      setLoading!(true)
      let httpError
      try {
        const response: AxiosResponse = await axios.get('/articles', getAuthHeader())
        if (response.status === HttpStatusCode.Ok && response.data) {
          setArticles(response.data)
        }
      } catch (error) {
        httpError = handleHttpError(error, wrapperRef as RefObject<HTMLDivElement>, flashMessage, setFlashMessage, TokenType.Auth, navigate)
      } finally {
        setLoading!(false)
      }
    })()
  }, [articles.length])

  const deleteArticle = async (artcl: TArticle): Promise<void> => {
    if (confirm(`Do you really want to delete article '${artcl.title}'`)) {
      let error
      try {
        const response: AxiosResponse = await axios.delete(`${'/articles'}/${artcl.id}`, getAuthHeader())
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
          hideFlashMessage(flashMessage, setFlashMessage)
          // setLoading!(false)
        }, NAVIGATE_DELAY)
      }
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <h3 className="text-2xl font-bold mb-4">Articles</h3>
      <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Button} className="my-2" to="/articles/new">New Article &raquo;</DelayedLink>
      <div className="m-2">
        {articles.map((article) => (
          <div className="my-2 flex flex-row justify-between items-center border-0 border-b-1" key={article.id}>
            <div className="my-1" key={`t${article.id}`}>
              <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="text-xl" to={`/articles/${article.id}`}>{article.title}</DelayedLink>
            </div>
            <div className="my-1" key={`d${article.id}`}>
              <CustomButton className="ml-4" onClick={() => deleteArticle(article)} size="large">Delete Article</CustomButton>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default Articles
