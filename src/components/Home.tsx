import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import DelayedLink from './shared/DelayedLink'
import { LinkType } from '../types/general.types'
import type { IGlobal } from '../types/general.types'

const Home: FC<IGlobal> = ({ loading, theme, setTheme, wrapperRef }): JSX.Element => {
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} wrapperRef={wrapperRef}>
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Home Page!</h1>
        <p className="mb-2">
          Here you can manage your
          <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="ml-1" to="/articles">Articles</DelayedLink> and your
          <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="ml-1" to="/profile">Profile</DelayedLink>.
        </p>
        <p className="mb-1">Scribble away, and save all your thoughts and ideas in one place!</p>
      </div>
    </Layout>
  )
}

export default Home
