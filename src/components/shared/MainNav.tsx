import type { FC, JSX } from 'react'
import { MouseEvent, useEffect, useState } from 'react'
import DelayedLink from './DelayedLink'
import Logout from './Logout'
import type { IMainNav } from '../../types/general.types'
import { isAuthenticated } from '../../utils/functions'
import { defaultRequestConfig } from '../../utils/defaults'

const MainNav: FC<IMainNav> = ({ wrapperRef, subNavOpen, setSubNavOpen }): JSX.Element => {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  useEffect(() => {
    isAuthenticated(setAuthenticated, defaultRequestConfig)
  }, [])

  const toggleMenu = (e: MouseEvent<HTMLDivElement>): void => {
    setSubNavOpen!(!subNavOpen)
    e.stopPropagation()
  }

  const burgerLinesUtilClasses = 'w-6 h-0.5 bg-white mx-0 my-1'
  const linkUtilClasses = 'block border border-t-0 border-main-content-bg px-6 py-4 sm:border-0 sm:inline-block sm:px-1 sm:py-2'
  // class="border border-t-0 border-main-content-bg"
  return (
    <nav className="mb-2 sm:mb-4 p-4 sm:border-b border-main-content-bg">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">
          <DelayedLink wrapperRef={wrapperRef} to="/" title="To Start Page">Scribble!</DelayedLink>
        </div>
        {authenticated && <div className="flex items-center">
          <div className="block sm:hidden cursor-pointer" onClick={(e: MouseEvent<HTMLDivElement>) => toggleMenu(e)}>
            <div className={burgerLinesUtilClasses}></div>
            <div className={burgerLinesUtilClasses}></div>
            <div className={burgerLinesUtilClasses}></div>
          </div>
          <ul className={`${subNavOpen ? 'flex flex-col' : 'hidden'} sm:hidden list-none w-full absolute top-16 left-0 bg-content-bg opacity-95`}>
            <li><DelayedLink wrapperRef={wrapperRef} to="/home" className={linkUtilClasses.replace('border-t-0', '')} title="To Home My Page">Home</DelayedLink></li>
            <li><DelayedLink wrapperRef={wrapperRef} to="/articles" className={linkUtilClasses} title="To My Articles Page">My Articles</DelayedLink></li>
            <li><DelayedLink wrapperRef={wrapperRef} to="/profile" className={linkUtilClasses} title="To My Profile Page">My Profile</DelayedLink></li>
            <li className={`${linkUtilClasses} flex flex-col items-end`}><Logout size="medium" /></li>
          </ul>
          <ul className="hidden sm:flex list-none">
            <li><DelayedLink wrapperRef={wrapperRef} to="/home" className={linkUtilClasses} title="To Home My Page">Home</DelayedLink></li>
            <li><DelayedLink wrapperRef={wrapperRef} to="/articles" className={linkUtilClasses} title="To My Articles Page">My Articles</DelayedLink></li>
            <li><DelayedLink wrapperRef={wrapperRef} to="/profile" className={linkUtilClasses} title="To My Profile Page">My Profile</DelayedLink></li>
            <li className="flex items-center"><Logout className="ml-2" size="small" title="Logout of Scribble!" /></li>
          </ul>
        </div>}
      </div>
    </nav>
  )
}

export default MainNav
