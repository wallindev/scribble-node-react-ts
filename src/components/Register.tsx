import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import AuthForm from './shared/AuthForm'
import type { IGlobal } from '../types/general.types'
import { setAuth } from '../utils/functions'

const Register: FC<IGlobal> = ({ loading, theme, setTheme }): JSX.Element => {
  const navigate = useNavigate()

  const handleRegister = (username: string, password: string): void => {
    // try {
    //   const response = await axios.post('/api/login', { username, password }) // Your Laravel login route
    //   localStorage.setItem('token', response.data.token) // Store the token
    //   '/' // Redirect to the article list
    // } catch (error) {
    //   console.error('Register error:', error)
    //   // Handle error (e.g., display a message)
    // }
    console.log("Registering user:", username, password) // Log the values (or make a real API call)
    setAuth(true)
    navigate('/home')
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <AuthForm formType="register" onSubmit={handleRegister} />
    </Layout>
  )
}

export default Register
