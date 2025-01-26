import { useState, FC } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// import ArticleList from './components/ArticleList';
// import ArticleDetails from './components/ArticleDetails';
// import Login from './components/Login';
// import ProtectedRoute from './components/ProtectedRoute';

import './App.css'

interface AppProps {
  title: string
  initialCount?: number 
}
/* 
 */
const App: FC<AppProps> = ({ title, initialCount = 0 }) => {
  const [count, setCount] = useState<number>(initialCount)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src='/vite.svg' className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src='./assets/react.svg' className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{title}</h1>
      <div className="card">
        <button onClick={() => setCount((prevCount) => prevCount + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
