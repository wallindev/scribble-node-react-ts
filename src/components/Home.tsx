import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import DelayedLink from './shared/DelayedLink'
import { LinkType } from '../types/general.types'
import type { IGlobal } from '../types/general.types'

const Home: FC<IGlobal> = ({ loading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <h3 className="text-2xl font-bold mb-4">Welcome to Your Home Page!</h3>
      <div className="mb-2">
        Here you can manage your
        <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="ml-1" to="/articles">Articles</DelayedLink> and your
        <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="ml-1" to="/profile">Profile</DelayedLink>.
      </div>
      <div className="mb-1">Scribble away, and save all your thoughts and ideas in one place!</div>
    </Layout>
  )
}

export default Home
