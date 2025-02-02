import { FC } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../App';
import Logout from './shared/Logout';

const StartPage: FC = () => {
  return (
    <div>
      <h1>Welcome to Your Home Page!</h1>
      <p>
        Here you can manage your <Link to="/articles">Articles</Link> and your <Link to="/profile">Profile</Link>.<br />
        Scribble away, and save all your thoughts and ideas in one place!
      </p>
      <div>
        <Link to="/articles" style={{ marginRight: '20px' }}>Articles</Link>
        <Link to="/profile">Profile</Link>
      </div>

      {isAuthenticated() && <div><br /><Logout /></div>}
    </div>
  );
}

export default StartPage
