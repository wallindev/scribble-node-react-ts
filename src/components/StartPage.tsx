import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import TextLink from './shared/TextLink'
import type { IGlobal } from '../types/general.types'

const StartPage: FC<IGlobal> = ({ loading, theme, setTheme, setLoading }): JSX.Element => {
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to Scribble!</h1>
        <div>
        <p>Scribble! - a tiny web app where you can create and manage your articles.</p>
        <p>Join our community and share your thoughts with the world!</p>
        </div>
        <div className="mt-2">
          <TextLink to="/login" style={{ marginRight: '20px' }}>Sign In</TextLink>
          <TextLink to="/register">Register</TextLink>
        </div>
      </div>
    </Layout>
  )
}

export default StartPage
