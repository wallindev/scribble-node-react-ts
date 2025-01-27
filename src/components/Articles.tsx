import { FC, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Article {
  id: number;
  title: string;
  content: string;
  // ... other properties
}

const Articles: FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const apiEndPoint = '/api/articles'
  const apiEndPointMock = 'http://grungecorp.dev:8888/articles'

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(apiEndPointMock, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in header
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
      {articles.map((article) => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
          <Link to={`/articles/${article.id}`}>{article.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Articles
