import { useRef } from 'react'
import type { FC, JSX } from 'react'
import { Theme } from '../../types/general.types'
import type { IThemeSelector } from '../../types/general.types'
import { TRANSITION_DURATION } from '../../utils/constants'

const ThemeSelector: FC<IThemeSelector> = ({ theme, setTheme }): JSX.Element => {
  const selectThemeRef = useRef<HTMLSelectElement>(null)

  const handleThemeChange = () => {
    const themeStringValue = selectThemeRef.current!.value
    const themeNumberValue = parseInt(themeStringValue)
    // Set Theme in state
    setTheme!(themeNumberValue)
    // Set Theme in Local Storage
    localStorage.setItem('theme', themeStringValue)
  }

  return (
    <div className="flex items-center" title="The Rainbow Colors = Red, Orange, Yellow, Green, Blue, Indigo, Violet plus a few more. Just for fun! =)">
      <div className="block mr-1 items-center">
        <div>
          <span className="text-red">R</span><span className="text-orange">O</span><span className="text-yellow">Y</span><span className="text-green">G</span><span className="text-blue">B</span><span className="text-indigo">I</span><span className="text-violet">V</span>
          &nbsp;Theme:
        </div>
      </div>
      <div className="relative inline-block w-20 text-center">
        <select ref={selectThemeRef} value={theme} onChange={handleThemeChange} className={`transition-colors duration-${TRANSITION_DURATION} block appearance-none w-full bg-content-bg border border-main-content-bg px-2 py-0.5 rounded shadow leading-tight focus-visible:outline-0 text-text cursor-pointer`}>
          {Object.keys(Theme).filter(k => isNaN(Number(k))).map((k, i) => <option className={`transition-colors duration-${TRANSITION_DURATION} bg-content-bg border border-main-content`} value={i} key={k}>{k}</option>)}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
