import type { FC, JSX } from 'react'
import TextLink from './TextLink'
import ThemeSelector from './ThemeSelector'
import type { IFooter } from '../../types/general.types'
import { TRANSITION_DURATION } from '../../utils/constants'

const Footer: FC<IFooter> = ({ theme, setTheme }): JSX.Element => {
  const adminUrl: string = `${window.location.protocol}//${window.location.hostname}:3000/admin`
  return (
    <div className={`transition-colors duration-${TRANSITION_DURATION} my-0 sm:mt-4 mx-auto p-2 pb-0 sm:p-4 sm:pb-0 sm:border-t border-main-content-bg`}>
      <div className="flex justify-between items-center text-xs">
        <div>&copy; {(new Date).getUTCFullYear()} <TextLink to="mailto: wallindev@gmail.com" className="outline-0 text-text visited:text-text hover:text-text-hover focus-visible:text-text-hover">wallindev</TextLink></div>
        <div><ThemeSelector theme={theme} setTheme={setTheme} /></div>
        <div><a href={adminUrl} className="opacity-[.1] outline-0 text-text visited:text-text hover:text-text-hover focus-visible:text-text-hover">Admin</a></div>
      </div>
    </div>
  )
}

export default Footer
