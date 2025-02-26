import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import TextLink from './shared/TextLink'
import CustomButton from './shared/CustomButton'
import type { IGlobal } from '../types/general.types'
import { isAuthenticated } from '../utils/functions'

const StartPage: FC<IGlobal> = ({ loading, theme, setTheme }): JSX.Element => {
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme}>
      <div>
        <h1 className="text-2xl font-bold">Welcome to Scribble!</h1>
        <div className="mt-4">
          <p className="mt-4">Scribble! - a tiny web app where you can create and manage your articles.</p>
          <p className="mt-2">Join our community and share your thoughts with the world!</p>
        </div>
        {/* !isAuthenticated() && <div className="flex flex-row sm:items-start mt-4">
          <CustomButton to="/login" className="max-sm:flex-1/2 mr-0.5 sm:mr-1" type="button">Log In</CustomButton>
          <CustomButton to="/register" className="max-sm:flex-1/2 ml-0.5 sm:ml-1" type="button">Register</CustomButton>
        </div> */}
        {!isAuthenticated() && <div className="flex flex-row sm:items-start mt-4">
          <TextLink className="max-sm:flex-1/2 mr-0.5 sm:mr-1" to="/login">Log In</TextLink>
          <TextLink className="max-sm:flex-1/2 ml-0.5 sm:ml-1" to="/register">Register</TextLink>
        </div>}
      </div>
    </Layout>
  )
}

export default StartPage
