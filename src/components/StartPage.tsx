// import { useEffect, useState } from 'react'
import type { FC, JSX } from 'react'
import Layout from './layout/Layout'
import DelayedLink from './shared/DelayedLink'
import { LinkType } from '../types/general.types'
import type { IGlobal } from '../types/general.types'
import { isAuthenticated } from '../utils/functions'
// import { defaultRequestConfig } from '../utils/defaults'

const StartPage: FC<IGlobal> = ({ loading, theme, setTheme, flashMessage, setFlashMessage, wrapperRef }): JSX.Element => {
  // const [authenticated, setAuthenticated] = useState<boolean>(false)
  // useEffect(() => {
  //   isAuthenticated(setAuthenticated, defaultRequestConfig)
  // }, [])
  return (
    <Layout loading={loading} theme={theme} setTheme={setTheme} flashMessage={flashMessage} setFlashMessage={setFlashMessage} wrapperRef={wrapperRef}>
      <>{console.log('rendering') /* TODO: Remove */}</>
      <h1 className="text-2xl font-bold">Welcome to Scribble!</h1>
      <div className="mt-4">
        <p className="mt-4">A tiny web app for creating and managing your
          {isAuthenticated() ?
            <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="ml-1" to="/articles">articles</DelayedLink> :
            <span className="ml-1">articles</span>}
        .</p>
        <p className="mt-2">Register today and start scribbling away your thoughts and dreams!</p>
      </div>
      {!isAuthenticated() && <div className="flex flex-row sm:items-start mt-4">
        <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="max-sm:flex-1/2 mr-0.5 sm:mr-1" to="/login">Log In</DelayedLink>
        <DelayedLink wrapperRef={wrapperRef} linkType={LinkType.Text} className="max-sm:flex-1/2 ml-0.5 sm:ml-1" to="/register">Register</DelayedLink>
      </div>}
    </Layout>
  )
}

export default StartPage
