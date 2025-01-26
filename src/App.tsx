import { FC, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyles from './GlobalStyles'

import Articles from './components/Articles'
import Article from './components/Article'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

interface AppProps {
  title: string
  initialCount?: number
}

const StyledContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
`

const StyledTitle = styled.h1`
  color: blue;
`

const App: FC<AppProps> = ({ title, initialCount = 0 }) => {
  const [count, setCount] = useState<number>(initialCount)

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}> {/* Routes that require authentication */}
          <Route path="/" element={<Articles />} />
          <Route path="/articles/:id" element={<Article />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirects to / if route not found */}
      </Routes>
    </Router>
  )
}

export default App
