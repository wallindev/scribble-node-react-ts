import { FC } from 'react'
import { Link } from 'react-router-dom'

const StartPage: FC = () => {
  return (
    <div>
      <h1>Welcome to Scribble!</h1>
      <p>
        Scribble! - a tiny web app where you can create and manage your articles.<br />
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
