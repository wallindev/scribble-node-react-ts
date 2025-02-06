import { FC, useState } from 'react'
import { AuthFormProps } from '../../types/form.types';

const AuthForm: FC<AuthFormProps> = ({ formType, onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(username, password);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>{formType}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{formType}</button>
      </form>
    );
  }

  export default AuthForm
