import { FC, FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

import AuthForm from './shared/AuthForm';

const Register: FC = () => {
  const navigate = useNavigate();

  const handleRegister = (username: string, password: string) => {
    console.log("Registering user:", username, password); // Log the values (or make a real API call)
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/home');
  };

  return (
    <AuthForm formType="Register" onSubmit={handleRegister} />
  );
};

// const Register: FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/login', { username, password }); // Your Laravel login route
//       localStorage.setItem('token', response.data.token); // Store the token
//       window.location.href = '/'; // Redirect to the article list
//     } catch (error) {
//       console.error('Register error:', error);
//       // Handle error (e.g., display a message)
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Input fields for username and password */}
//       <button type="submit">Register</button>
//     </form>
//   );
// };

export default Register
