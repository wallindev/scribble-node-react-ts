import { FC, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import type { Article } from '../types/article.types'
import LinkButton from './shared/LinkButton';
import FormButton from './shared/FormButton';

const Article: FC = () => {
  const { id } = useParams<{ id: string }>()
  console.log('id: ', id)
  const articleId = id || null
  console.log('articleId: ', articleId)
  const enum Mode { SHOW, EDIT, NEW }
  const [articleMode, setArticleMode] = useState(id ? Mode.SHOW : Mode.NEW)
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
    created: '',
    modified: ''
  })

  let apiEndPoint = '/api/articles'
  if (articleId) apiEndPoint = `${apiEndPoint}/${articleId}`
  let apiEndPointMock = 'http://grungecorp.dev:8888/articles'
  if (articleId) apiEndPointMock = `${apiEndPointMock}/${articleId}`

  useEffect(() => {
    if (articleId) {
      const fetchArticle = async () => {
        try {
          const response = await axios.get(apiEndPointMock, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setArticle(response.data);
        } catch (error) {
          console.error('Error fetching article:', error);
        }
      };

      fetchArticle();
    }
  }, [articleId])

  // Update existing Article (PATCH). Partial<Article> because of the PATCH partial update.
  const updateArticle = async (article: Partial<Article>) => {
    article = {...article, modified: new Date().toLocaleString("sv-SE", { timeZone: "CET" })}
    try {
      const response = await axios.patch(apiEndPointMock, article)
      console.log('Article updated:', response.data)
      setArticle(response.data)
      setArticleMode(Mode.SHOW)
      // return response.data
    } catch (error) {
      console.error('Error updating article:', error)
      throw error
    }
  }

  // Store new Article (POST)
  const storeArticle = async (article: Article) => {
    let date : string = new Date().toLocaleString("sv-SE", { timeZone: "CET" })
    article = {...article, created: date, modified: date}
    try {
      const response = await axios.post(apiEndPointMock, article)
      setArticle(response.data)
      location.href = '/articles'
      // return response.data
    } catch (error) {
      console.error('Error storing article:', error)
      throw error
    }
  }

  return (
    <div>
      {articleMode === Mode.EDIT || articleMode === Mode.NEW ? (
        <div>
          <h2>{articleMode === Mode.EDIT ? 'Edit' : 'New'} Article</h2>
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            type="text"
            value={article.title}
            onChange={e => setArticle({...article, title: e.target.value})}
          />
          <br />
          <br />
          <label htmlFor="content">Content: </label>
          <textarea
            id="content"
            value={article.content}
            onChange={e => setArticle({...article, content: e.target.value})}
          />
          <br />
          <br />
          {
            articleId ?
              <FormButton onClick={() => setArticleMode(Mode.SHOW)}>Cancel</FormButton> :
              <LinkButton to="/articles">&laquo; Cancel</LinkButton>
          }&nbsp;&nbsp;&nbsp;
          <FormButton onClick={() => articleId ? updateArticle(article) : storeArticle(article)}>Save</FormButton>
        </div>
      ) : (
        <div>
          {/* <p>Article ID: {id}</p> */}
          <h2>{article.title}</h2>
          <p>{article.content}</p>
          <p>
            <small>
              Created: {new Date(article.created).toLocaleString("sv-SE", { timeZone: "CET" })} |
              Modified: {new Date(article.modified).toLocaleString("sv-SE", { timeZone: "CET" })}
            </small>
          </p>
          <LinkButton to="/articles">&laquo; All Articles</LinkButton>&nbsp;&nbsp;&nbsp;
          <FormButton onClick={() => setArticleMode(Mode.EDIT)}>Edit</FormButton>
        </div>
      )}
    </div>
  );
};

export default Article
