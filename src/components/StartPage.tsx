import { FC } from 'react'
import { Link } from 'react-router-dom'

import GlobalStyle from './components/GlobalStyles'

const StartPage: FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' // Make it take up the full viewport height
    }}>
      <h1>Welcome to the Articles App</h1>
      <p style={{ textAlign: 'center', maxWidth: '600px', margin: '20px 0' }}>
        This is a platform where you can discover, create, and manage your articles.  
        Join our community and share your thoughts with the world!
      </p>
      <div> {/* Container for the links */}
        <Link to="/login" style={{ marginRight: '20px' }}>Sign In</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default StartPage
