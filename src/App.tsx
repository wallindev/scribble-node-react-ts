import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import GlobalStyle from './GlobalStyle'

import StartPage from './components/StartPage'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Articles from './components/Articles'
import Article from './components/Article'
import ProtectedRoute from './components/ProtectedRoute'

const App: FC = () => {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<Article />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
