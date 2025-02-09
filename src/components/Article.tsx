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
import { replaceNewlinesWithBr } from '../functions'
import { localDateStr } from '../functions'

// import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'

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
  const enum Mode {
    Show,
    Edit,
    New
  }
  const [articleMode, setArticleMode] = useState(searchParams.has('edit') ? Mode.Edit : article.id ? Mode.Show : Mode.New)

  // let apiEndPoint = '/api/articles'
  // if (article.id) apiEndPoint = `${apiEndPoint}/${article.id}`
  let apiEndPointMock = 'http://192.168.32.2:8000/articles'
  if (article.id) apiEndPointMock = `${apiEndPointMock}/${article.id}`

  useEffect(() => {
    setArticleMode(searchParams.has('edit') ? Mode.Edit : article.id ? Mode.Show : Mode.New)
    if (article.id) {
      /* const fetchArticle =  */(async () => {
        setLoading(true)
        try {
          const response: AxiosResponse = await axios.get(apiEndPointMock/* , {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          } */)
          setArticle(response.data)
        } catch (error) {
          console.error('Error fetching article:', error)
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
  }, [article.id, searchParams])

  const dismissFlashMessage = () => {
    setFlashMessage({ ...flashMessage, visible: false })
  }

  const saveArticle = (): void => {
    const articleData: IArticle = {
      title: (document.getElementById('title') as HTMLDivElement).innerText,
      content: (document.getElementById('content') as HTMLDivElement).innerText,
      created: articleMode === Mode.Edit ? null : localDateStr(),
      modified: localDateStr(),
    }
    // console.log('articleData: ', articleData)
    articleMode === Mode.Edit ? updateArticle(articleData) : storeArticle(articleData)
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
      setArticle(response.data)
      navigate(`/articles/${response.data.id}`)
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

  return loading ? <LoadText /> : (
    <Layout>
      <div>
        {flashMessage.visible && (
          <FlashMessage
            message={flashMessage.message}
            type={flashMessage.type}
            onDismiss={dismissFlashMessage}
          />
        )}
        <h3 className="text-xl mb-4">{articleMode === Mode.Edit ? 'Edit' : 'New'} Article</h3>
        <h2
          id="title"
          className={`text-2xl mb-4 p-4${articleMode !== Mode.Show && ' inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)]'}`}
          dangerouslySetInnerHTML={{ __html: replaceNewlinesWithBr(article.title) }}
          contentEditable={articleMode !== Mode.Show ? true : false}
        />
        <div
          id="content"
          className={`mt-2 mb-4 p-4${articleMode !== Mode.Show && ' inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)]'}`}
          dangerouslySetInnerHTML={{ __html: replaceNewlinesWithBr(article.content) }}
          contentEditable={articleMode !== Mode.Show ? true : false}
        />
        <div className="flex justify-between items-center mb-4 text-xs">
          <div>Created: {localDateStr(article.created)}</div>
          <div>Modified: {localDateStr(article.modified)}</div>
        </div>
        {articleMode === Mode.Show ? (
          <>
            <CustomButton onClick={() => navigate('/articles')} className="mr-4">&laquo; All Articles</CustomButton>
            <CustomButton onClick={() => navigate('?edit')}>Edit</CustomButton>
          </>
        ) : (
          <>
            <CustomButton type="button" onClick={() => articleMode === Mode.Edit ? setSearchParams() : navigate('/articles')}>&laquo; Cancel</CustomButton>
            <CustomButton type="submit" onClick={saveArticle} className="ml-4">{articleMode === Mode.Edit ? 'Update' : 'Save'}</CustomButton>
          </>
        )}
      </div>
      {/* <>
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
              className="p-1 bg-input-bg text-input-text w-full sm:w-4/5 border-0 outline-0 rounded-sm overflow-hidden"
              onChange={(e: ChangeEvent): void => setArticle({...article, content: (e.currentTarget as HTMLInputElement).value})}
            />
          </div>
        </div>
        <CustomButton type="button" onClick={() => article.id ? setSearchParams() : navigate('/articles')}>&laquo; Cancel</CustomButton>
        <CustomButton type="submit" onClick={saveArticle} className="ml-4">{article.id ? 'Update' : 'Save'}</CustomButton>
      </> */}
    </Layout>
  )
}

export default Article
