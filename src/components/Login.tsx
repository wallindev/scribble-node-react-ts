import { FC, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    location.href='/home'
    // try {
    //   const response = await axios.post('/api/login', { username, password }); // Your Laravel login route
    //   localStorage.setItem('token', response.data.token); // Store the token
    //   window.location.href = '/'; // Redirect to the article list
    // } catch (error) {
    //   console.error('Login error:', error);
    //   // Handle error (e.g., display a message)
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for username and password */}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login
