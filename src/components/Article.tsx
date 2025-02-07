import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import type { FC, JSX, ChangeEvent, FormEvent } from 'react'
import type { AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import TextInput from './shared/TextInput'
import CustomButton from './shared/CustomButton'
import LoadText from './shared/LoadText'
import FlashMessage from './shared/FlashMessage'
import type { IArticle } from '../types/article.types'
import { localDateStr } from '../functions'

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'

const Article: FC = (): JSX.Element => {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()
  // const articleId = params.id || null
  const [searchParams, setSearchParams] = useSearchParams()
  const [article, setArticle] = useState<IArticle>({
    id: params.id || null,
    title: '',
    content: '',
    created: null,
    modified: ''
  })
  const [loading, setLoading] = useState(article.id ? true : false)
  const [flashMessage, setFlashMessage] = useState<{
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    visible: boolean
  }>({ message: '', type: 'success', visible: false })

  // let apiEndPoint = '/api/articles'
  // if (article.id) apiEndPoint = `${apiEndPoint}/${article.id}`
  let apiEndPointMock = 'http://192.168.32.2:8000/articles'
  if (article.id) apiEndPointMock = `${apiEndPointMock}/${article.id}`

  useEffect(() => {
    if (article.id) {
      /* const fetchArticle =  */(async () => {
        // console.log('fetchArticle, article.id:', article.id)
        setLoading(true)
        try {
          const response: AxiosResponse = await axios.get(apiEndPointMock/* , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          } */)
          // console.log('fetchArticle, response.data:', response.data)
          const resArticle: IArticle = response.data
          // console.log('fetchArticle, resArticle:', resArticle)
          setArticle(resArticle)
          // console.log('article after fetchArticle setArticle (global):', article)
        } catch (error) {
          // console.error('Error fetching article:', error)
          setFlashMessage({
            message: `Error fetching article:<br />${error}`,
            type: 'error',
            visible: true,
          })
        } finally {
          setLoading(false)
        }
      })()

      // Simulate throttling (to be able to see the LoadText component)
      // setTimeout(() => {
        // fetchArticle()
      // }, 10000)
    }
  }, [article.id])

  const dismissFlashMessage = () => {
    setFlashMessage({ ...flashMessage, visible: false })
  }

  // Update existing Article (PATCH). Partial<Article> because of the PATCH partial update.
  const updateArticle = async (artcl: Partial<IArticle>) => {
    try {
      const response = await axios.patch(apiEndPointMock, artcl)
      setArticle(response.data)
    } catch (error) {
      console.error('Error updating article:', error)
      setFlashMessage({
        message: `Error updating article:<br />${error}`,
        type: 'error',
        visible: true,
      })
    } finally {
      setFlashMessage({
        message: 'Article updated successfully',
        type: 'success',
        visible: true,
      })
      // Remove querystring, so '/articles/:id?edit' becomes '/articles/:id'
      setSearchParams()
    }
  }

  // Store new Article (POST)
  const storeArticle = async (artcl: IArticle): Promise<void> => {
    try {
      const response = await axios.post(apiEndPointMock, artcl)
      // console.log('article from axios.post:', response.data)
      console.log('storeArticle, response.data:', response.data)
      const resArticle: IArticle = response.data
      console.log('storeArticle, resArticle:', resArticle)
      setArticle(resArticle)
      navigate(`/articles/${response.data.id}`)
      // console.log('article after storeArticle setArticle (local):', artcl)
      // console.log('article after storeArticle setArticle (global):', article)
    } catch (error) {
      console.error('Error saving article:', error)
      setFlashMessage({
        message: `Error saving article:<br />${error}`,
        type: 'error',
        visible: true,
      })
    } finally {
      setFlashMessage({
        message: 'Article saved successfully',
        type: 'success',
        visible: true,
      })
      // setTimeout(() => {
      // }, 3000)
    }
  }
  // console.log('article before return loading:', article)
  return loading ? <LoadText /> : (
    <Layout>
      {article.id && !searchParams.has('edit') ? (
        <div>
          {flashMessage.visible && (
            <FlashMessage
              message={flashMessage.message}
              type={flashMessage.type}
              onDismiss={dismissFlashMessage}
            />
          )}
          <h2>
            isBrowser: {isBrowser.toString()}<br />
            isMobile: {isMobile.toString()}
          </h2>
          <BrowserView>This is a BrowserView</BrowserView>
          <MobileView>This is a MobileView</MobileView>
          <h2 className="text-2xl mb-4">{article?.title}</h2>
          <div>{article?.content}</div>
          <div>
            <small>
              Created: {localDateStr(article?.created)} | Modified: {localDateStr(article?.modified)}
            </small>
          </div>
          <CustomButton onClick={() => navigate('/articles')} className="mr-4">&laquo; All Articles</CustomButton>
          <CustomButton onClick={() => navigate('?edit')}>Edit</CustomButton>
        </div>
      ) : (
        <form onSubmit={(e: FormEvent): void => {
          e.preventDefault()
          const articleData: IArticle = {
            title: (document.getElementById('title') as HTMLInputElement).value,
            content: (document.getElementById('content') as HTMLInputElement).value,
            created: searchParams.has('edit') ? null : localDateStr(),
            modified: localDateStr(),
          }
          searchParams.has('edit') ? updateArticle(articleData) : storeArticle(articleData)
        }}>
          <h2 className="text-2xl mb-4">{searchParams.has('edit') ? 'Edit' : 'New'} Article</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block" htmlFor="title">Title: </label>
              <TextInput
                id="title"
                type="text"
                name="title"
                value={article?.title}
                onChange={(e: ChangeEvent): void => setArticle({...article, title: (e.currentTarget as HTMLInputElement).value})}
              />
            </div>
            <div>
              <label className="block" htmlFor="content">Content: </label>
              <textarea
                id="content"
                name="content"
                value={article?.content}
                className="p-1 bg-input-bg text-input-text w-full sm:w-4/5 border-0 outline-0 rounded-sm"
                onChange={(e: ChangeEvent): void => setArticle({...article, content: (e.currentTarget as HTMLInputElement).value})}
              />
            </div>
          </div>
          <CustomButton type="button" onClick={() => article.id ? setSearchParams() : navigate('/articles')}>&laquo; Cancel</CustomButton>
          <CustomButton type="submit" className="ml-4">{article.id ? 'Update' : 'Save'}</CustomButton>
        </form>
      )}
    </Layout>
  )
}

export default Article
