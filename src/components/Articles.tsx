import { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

import LinkButton from './shared/LinkButton'
import type { Article } from '../types/article.types'

const Articles: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const apiEndPoint = '/api/articles'
  const apiEndPointMock = 'http://grungecorp.dev:8888/articles'

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(apiEndPointMock, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div>
      <LinkButton to='/articles/new'>New Article &raquo;</LinkButton>
      {articles.map((article) => (
        <div key={article.id}>
          <Link to={`/articles/${article.id}`}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Articles
