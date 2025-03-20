import { BrowserRouter as Router, Navigate, Routes, Route } from 'react-router-dom'
import { useEffect, useRef, useState  } from 'react'
import type { FC, JSX } from 'react'
import StartPage from './components/StartPage'
import Login from './components/Login'
import Register from './components/Register'
import Verify from './components/Verify'
import Home from './components/Home'
import User from './components/User'
import Articles from './components/Articles'
import Article from './components/Article'
import ProtectedRoute from './components/ProtectedRoute'
import { Theme, TFlashMessage } from './types/general.types'
import { defaultFlashMessage } from './utils/defaults'
import './utils/config'

const App: FC = (): JSX.Element => {
  const [theme, setTheme] = useState<Theme>(Theme.Default)
  const [loading, setLoading] = useState<boolean>(false)
  const [flashMessage, setFlashMessage] = useState<TFlashMessage>(defaultFlashMessage)
  const wrapperRef = useRef<HTMLInputElement>(null)

  // Check if user stored theme before
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    storedTheme && setTheme(parseInt(storedTheme, 10))
  }, [])

  const globalProps = {
    theme,
    setTheme,
    loading,
    setLoading,
    flashMessage,
    setFlashMessage,
    wrapperRef
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage {...globalProps} />} />
        <Route path="/login" element={<Login {...globalProps} />} />
        <Route path="/register" element={<Register {...globalProps} />} />
        <Route path="/verify/:verifyToken" element={<Verify {...globalProps} />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home {...globalProps} />} />
          <Route path="/profile" element={<User {...globalProps} />} />
          <Route path="/profile?edit" element={<User {...globalProps} />} />
          <Route path="/articles" element={<Articles {...globalProps} />} />
          <Route path="/articles/new" element={<Article {...globalProps} />} />
          <Route path="/articles/:id" element={<Article {...globalProps} />} />
          <Route path="/articles/:id?edit" element={<Article {...globalProps} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
