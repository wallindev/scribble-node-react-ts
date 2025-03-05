import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import TextLink from './shared/TextLink'
import type { IGlobal } from '../types/general.types'
import { isAuthenticated } from '../utils/functions'

const StartPage: FC<IGlobal> = ({ loading, theme, setTheme }): JSX.Element => {
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <div>
        <h1 className="text-2xl font-bold">Welcome to Scribble!</h1>
        <div className="mt-4">
          <p className="mt-4">A tiny web app for creating and managing your
             {!isAuthenticated() && <span className="ml-1">articles</span>}
             {isAuthenticated() && <TextLink className="ml-1" to="/articles">articles</TextLink>}.
          </p>
          <p className="mt-2">Join our community and share your thoughts with the world!</p>
        </div>
        {!isAuthenticated() && <div className="flex flex-row sm:items-start mt-4">
          <TextLink className="max-sm:flex-1/2 mr-0.5 sm:mr-1" to="/login">Log In</TextLink>
          <TextLink className="max-sm:flex-1/2 ml-0.5 sm:ml-1" to="/register">Register</TextLink>
        </div>}
      </div>
    </Layout>
  )
}

export default StartPage
