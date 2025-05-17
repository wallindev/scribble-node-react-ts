import type { FC, JSX } from 'react'
import TextLink from './TextLink'
// import ThemeSelector from './ThemeSelector'
import type { IFooter } from '../../types/general.types'
import { TRANSITION_DURATION } from '../../utils/constants'

const Footer: FC<IFooter> = (/* { theme, setTheme } */): JSX.Element => {
  return (
    <div className={`transition-colors duration-${TRANSITION_DURATION} my-0 sm:mt-4 mx-auto p-2 pb-0 sm:p-4 sm:pb-0 sm:border-t border-main-content-bg`}>
      <div className="flex justify-between items-center text-xs">
        <div>&copy; {(new Date).getUTCFullYear()} <TextLink className="outline-0 text-text visited:text-text hover:text-text-hover focus-visible:text-text-hover" to="mailto: wallindev@gmail.com">wallindev</TextLink></div>
        <div>{/* <ThemeSelector theme={theme} setTheme={setTheme} /> */}</div>
      </div>
    </div>
  )
}

export default Footer
