import { FC, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

import AuthForm from './shared/AuthForm'

const Login: FC = () => {
  const navigate = useNavigate()

  const handleLogin = (username: string, password: string) => {
    if (username === 'testuser' && password === 'password') {
      localStorage.setItem('AUTHENTICATED', 'true')
      navigate('/home')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <AuthForm formType="Login" onSubmit={handleLogin} />
  )
}

// const Login: FC = () => {
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await axios.post('/api/login', { username, password }) // Your Laravel login route
//       localStorage.setItem('token', response.data.token) // Store the token
//       navigate('/home') // Redirect to the user home page
//     } catch (error) {
//       console.error('Login error:', error)
//       // Handle error (e.g., display a message)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Input fields for username and password */}
//       <button type="submit">Login</button>
//     </form>
//   )
// }

export default Login
