import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { FC, JSX } from 'react'
import type { AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import CustomButton from './shared/CustomButton'
import FlashMessage from './shared/FlashMessage'
import TextLink from './shared/TextLink'
import type { TArticle, IGlobal, TFlashMessage } from '../types/general.types'
import { dismissFlashMessage, getToken } from '../utils/functions'
import { defaultFlashMessage } from '../utils/defaults'

const Articles: FC<IGlobal> = ({ loading, setLoading, theme, setTheme }): JSX.Element => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<TArticle[]>([])
  const [flashMessage, setFlashMessage] = useState<TFlashMessage>(defaultFlashMessage)

  useEffect(() => {
    !(async (): Promise<void> => {
      setLoading!(true)
      try {
        const response: AxiosResponse = await axios.get('/articles', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        // console.log(response.data)
        setArticles(response.data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        // To mock slow network
        // setTimeout(() => {
          setLoading!(false)
        // }, 5000)
      }
    })()
  }, [])

  const deleteArticle = (artcl: TArticle): void => {
    if (confirm(`Do you really want to delete article '${artcl.title}'`)) {
      !(async (): Promise<void> => {
        setLoading!(true)
        try {
          const response: AxiosResponse = await axios.delete(`${'/articles'}/${artcl.id}`/* , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          } */)
          // console.log('response.data:', response.data)
          const deletedArticle = response.data
          const newArticles = articles.filter(article => article.id !== deletedArticle.id)
          setArticles(newArticles)
        } catch (error) {
          console.error('Error deleting article:', error)
          setFlashMessage({
            message: `Error updating article:<br />${error}`,
            type: 'error',
            visible: true,
          })
        } finally {
          setFlashMessage({
            message: 'Article removed successfully',
            type: 'success',
            visible: true,
          })
          console.log('Deleted article', artcl.id)
          // To mock slow network
          // setTimeout(() => {
            setLoading!(false)
          // }, 5000)
        }
      })()
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
