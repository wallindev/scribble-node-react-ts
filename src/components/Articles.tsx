import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { FC, JSX } from 'react'
import type { AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import CustomButton from './shared/CustomButton'
import TextLink from './shared/TextLink'
import LoadText from './shared/LoadText'
import type { IArticle } from '../types/article.types'

const Articles: FC = (): JSX.Element => {
  const navigate = useNavigate()
  const [articles, setArticles] = useState<IArticle[]>([])
  const [loading, setLoading] = useState(true)
  // const apiEndPoint = '/api/articles'
  const apiEndPointMock = 'http://192.168.32.2:8000/articles'

  useEffect(() => {
    /* const fetchArticles =  */(async (): Promise<void> => {
      // setLoading(true)
      try {
        const response: AxiosResponse = await axios.get(apiEndPointMock/* , {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        } */)
        setArticles(response.data)
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    })()

    // Simulate throttling (to be able to see the LoadText component)
    // setTimeout(() => {
    //   fetchArticles()
    // }, 5000)
  }, [])

  return/*  loading ? <LoadText loading={loading} /> : */ (
    <Layout>
      <div className="m-2">
        <CustomButton onClick={() => navigate('/articles/new')}>New Article &raquo;</CustomButton>
        <div className="my-2">
          {articles.map((article) => (
            <div key={article.id} className="my-1">
                <TextLink to={`/articles/${article.id}`} className="text-lg">{article.title}</TextLink>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export default Articles
