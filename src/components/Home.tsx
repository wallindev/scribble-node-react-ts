import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
// import Logout from './shared/Logout'
import TextLink from './shared/TextLink'
import type { IGlobal } from '../types/general.types'

const Home: FC<IGlobal> = ({ loading, theme, setTheme }): JSX.Element => {
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Home Page!</h1>
        <p className="mb-2">Here you can manage your <TextLink to="/articles">Articles</TextLink> and your <TextLink to="/profile">Profile</TextLink>.</p>
        <p className="mb-1">Scribble away, and save all your thoughts and ideas in one place!</p>
      </div>
    </Layout>
  )
}

export default Home
