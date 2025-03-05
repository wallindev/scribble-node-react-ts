import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios, { HttpStatusCode, isAxiosError } from 'axios'
import type { FocusEvent, FC, JSX, KeyboardEvent, KeyboardEventHandler } from 'react'
import type { AxiosError, AxiosResponse } from 'axios'
import Layout from './layout/Layout'
import CustomButton from './shared/CustomButton'
import FlashMessage from './shared/FlashMessage'
import { Mode } from '../types/general.types'
import type { IGlobal, Mode as TMode, TFlashMessage, TArticle } from '../types/general.types'
import { consoleError, dismissFlashMessage, getToken, getUserId, localDateStr, replaceNewlinesWithBr, selectElementText, setElementText } from '../utils/functions'
import { defaultArticle, defaultFlashMessage, defaultContentText, defaultTitleText } from '../utils/defaults'

// import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect'

const Article: FC<IGlobal> = ({ loading, setLoading, theme, setTheme }): JSX.Element => {
  const params = useParams<{ id: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState<TArticle>(defaultArticle)
  const [flashMessage, setFlashMessage] = useState<TFlashMessage>(defaultFlashMessage)
  const [articleMode, setArticleMode] = useState<TMode>(Mode.Edit)
  const divTitleRef = useRef<HTMLDivElement>(null)
  const divContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // console.log('useEffect without dep')
    articleMode === Mode.New && setPlaceholderTexts()
    // console.log("searchParams.has('edit'):", searchParams.has('edit'))
    // console.log('params.id:', params.id)
    setArticleMode(searchParams.has('edit') ? Mode.Edit : params.id ? Mode.Show : Mode.New)
  })

  // useEffect(() => {
  //   console.log('useEffect with empty dep')
  // }, [])

  useEffect(() => {
    // TODO: Check if setFlashMessage and setPlaceholderTexts work correctly
    // console.log(Mode[articleMode])
    articleMode === Mode.Show && setFlashMessage(defaultFlashMessage)
    if (params.id) {
      if (!Number.isInteger(Number(params.id))) {
        setFlashMessage({
          message: 'Invalid article ID',
          type: 'error',
          visible: true,
        })
      } else {
        !(async (): Promise<void> => {
          setLoading!(true)
          let error
          try {
            const response: AxiosResponse = await axios.get(`/articles/${params.id}`, {
              headers: {
                Authorization: `Bearer ${getToken()}`,
              },
            })
            if (response.status === 200 && response.data) {
              setArticle(response.data)
            }
          } catch (e) {
            if (isAxiosError(e)) {
              error = e as AxiosError
              consoleError(error)
              switch (error.status) {
                case HttpStatusCode.NotFound:
                  setFlashMessage({
                    message: 'Article not found',
                    type: 'error',
                    visible: true,
                  })
                  break
                default:
                  setFlashMessage({
                    message: 'Something unexpected happened.',
                    type: 'error',
                    visible: true,
                  })
              }
            } else {
              console.error(`Error fetching article:\n${e}`)
              setFlashMessage({
                message: `Error fetching article:<br />${e}`,
                type: 'error',
                visible: true,
              })
            }
          } finally {
            // To mock slow network
            // setTimeout(() => {
            setLoading!(false)
            // }, 5000)
          }
        })()
      }
    }
    // TODO: searchParams.get or searchParams.has or something else?
  }, [params.id, searchParams.has('edit')])

  const saveArticle = (): void => {
    const articleData: TArticle = {
      title: (divTitleRef.current as HTMLDivElement).innerText,
      content: (divContentRef.current as HTMLDivElement).innerText,
      created: articleMode === Mode.Edit ? null : localDateStr(),
      modified: localDateStr(),
      userId: getUserId()
    }
    // console.log('articleData: ', articleData)

    articleMode === Mode.Edit ? updateArticle(articleData) : storeArticle(articleData)
  }

  // Update existing Article (PATCH). Partial<Article> because of the PATCH partial update.
  const updateArticle = async (artcl: Partial<TArticle>): Promise<void> => {
    let error
    try {
      // console.log('params.id:', params.id)
      const response: AxiosResponse = await axios.patch(`/articles/${params.id}`, artcl, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      // console.log('response.data:', response.data)
      if (response.data) {
        setArticle(response.data)
      }
    } catch (e) {
      if (isAxiosError(e)) {
        error = e as AxiosError
        consoleError(error)
        setFlashMessage({
          message: 'An error occured when updating article',
          type: 'error',
          visible: true,
        })
      } else {
        error = e
        console.error("Error updating article:\n", error)
        setFlashMessage({
          message: `Error updating article:<br />${error}`,
          type: 'error',
          visible: true,
        })
      }
    }
    if (!error) {
      setFlashMessage({
        message: 'Article updated successfully',
        type: 'success',
        visible: true,
      })
      setTimeout(() => {
        // Remove querystring, so '/articles/:id?edit' becomes '/articles/:id'
        setSearchParams('')
      }, 3000)
    }
  }

  // Store new Article (POST)
  const storeArticle = async (artcl: TArticle): Promise<void> => {
    let error, newArticleId: number
    try {
      // console.log('params.id:', params.id)
      const response: AxiosResponse = await axios.post('/articles', artcl, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      // console.log('response.data:', response.data)
      if (response.data) {
        setArticle(response.data)
        newArticleId = response.data.id
      }
    } catch (e) {
      if (isAxiosError(e)) {
        error = e as AxiosError
        consoleError(error)
        console.error('Error saving article:', error)
        setFlashMessage({
          message: `Error saving article:<br />${error}`,
          type: 'error',
          visible: true,
        })
      } else {
        error = e
        console.error("Error saving article:\n", error)
        setFlashMessage({
          message: `Error saving article:<br />${error}`,
          type: 'error',
          visible: true,
        })
      }
    }
    if (!error) {
      setFlashMessage({
        message: 'Article created successfully',
        type: 'success',
        visible: true,
      })
      setTimeout(() => {
        navigate(`/articles/${newArticleId}`)
      }, 3000)
      // console.log(articleMode)
      // TODO: is this needed?
      // Change mode to Show
      // setArticleMode(Mode.Show)
    }
  }

  const setPlaceholderTexts = (): void => {
    if (divTitleRef.current && divContentRef.current) {
      setElementText(divTitleRef.current, defaultTitleText)
      setElementText(divContentRef.current, defaultContentText)
      selectElementText(divTitleRef.current, defaultTitleText)
    }
  }

  const keyDownOnElement: KeyboardEventHandler = (key: KeyboardEvent<HTMLDivElement>) => {
    if (key.code.toUpperCase() === 'ENTER' || key.code.toUpperCase() === 'NUMPADENTER') {
      key.preventDefault()
      saveArticle()
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <div>
        {flashMessage.visible && (
          <FlashMessage
            message={flashMessage.message}
            type={flashMessage.type}
            onDismiss={() => dismissFlashMessage(flashMessage, setFlashMessage)}
          />
        )}
        {/* article.title && article.content ? <> */}
        <h3 className="text-2xl font-bold mb-4">{articleMode === Mode.Edit ? 'Edit ' : articleMode === Mode.New ? 'New ' : ''}Article</h3>
        <div
          ref={divTitleRef}
          className={`${articleMode !== Mode.Show ? 'inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 ' : ''}block text-2xl mb-4`}
          dangerouslySetInnerHTML={{ __html: article.title }}
          contentEditable={articleMode !== Mode.Show ? true : false}
          onFocus={(e: FocusEvent<HTMLDivElement>) => { articleMode === Mode.New ? selectElementText(e.target, defaultTitleText) : undefined }}
          onKeyDown={keyDownOnElement}
        />
        <div
          ref={divContentRef}
          className={`${articleMode !== Mode.Show ? 'inset-shadow-[2px_2px_5px_rgba(0,0,0,0.3)] p-2 ' : ''}min-h-32 block mt-2 mb-4`}
          dangerouslySetInnerHTML={{ __html: replaceNewlinesWithBr(article.content) }}
          contentEditable={articleMode !== Mode.Show ? true : false}
          onFocus={(e: FocusEvent<HTMLDivElement>) => { articleMode === Mode.New ? selectElementText(e.target, defaultContentText) : undefined }}
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
            <CustomButton type="button" onClick={() => articleMode === Mode.Edit ? navigate(`/articles/${params.id}`) : navigate('/articles')}>&laquo; Cancel</CustomButton>
            <CustomButton type="submit" onClick={saveArticle} className="ml-4">{articleMode === Mode.Edit ? 'Update' : 'Save'}</CustomButton>
          </>
        )}
        {/* </> : <CustomButton onClick={() => navigate('/articles')} className="mr-4">&laquo; All Articles</CustomButton> */}
      </div>
    </Layout>
  )
}

export default Article
