import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import AuthForm from './shared/AuthForm'
import type { IGlobal } from '../types/general.types'
import { login } from '../utils/functions'

const Login: FC<IGlobal> = ({ loading, theme, setTheme }): JSX.Element => {
  const navigate = useNavigate()

  const handleLogin = async (username: string, password: string): Promise<void> => {
    // try {
    //   const response: AxiosResponse = await axios.post('/api/login', { email, password })
    //   localStorage.setItem('token', response.data.token) // Store the token
    //   navigate('/home') // Redirect to the user home page
    // } catch (error) {
    //   console.error('Login error:', error)
    //   // Handle error (e.g., display a message)
    // }
    if (username === 'mikael' && password === 'grunge' ||
      username === 'lisbeth' && password === 'larsson') {
      login()
      navigate('/home')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <AuthForm formType="login" onSubmit={handleLogin} />
    </Layout>
  )
}

export default Login
