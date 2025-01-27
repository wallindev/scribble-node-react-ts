import { FC } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import styled from 'styled-components'

import GlobalStyles from './GlobalStyles'

import StartPage from './components/StartPage'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Articles from './components/Articles'
import Article from './components/Article'
import ProtectedRoute from './components/ProtectedRoute'

// can be used with styled.div<Interface|Types|Props>
const StyledContainer = styled.div`
  background-color: #f0f0f0;
  padding: 20px;
`

// can be used with styled.h1<Interface|Types|Props>
const StyledTitle = styled.h1`
  color: blue;
`

const App: FC = () => {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/home" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:id" element={<Article />} />
        {/* </Route> */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
