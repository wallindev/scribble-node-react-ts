import { useEffect, useRef/* , useState */ } from 'react'
import { useLocation } from 'react-router-dom'
import type { FC, JSX } from 'react'
// import LoadText from '../shared/LoadText'
import MainNav from '../shared/MainNav'
import Footer from '../shared/Footer'
import { Theme } from '../../types/general.types'
import type { ILayout } from '../../types/general.types'

const Layout: FC<ILayout> = ({ /* loading,  */theme, setTheme, children }): JSX.Element => {
  // const [isVisible, setIsVisible] = useState(true)
  const location = useLocation()
  const divRef = useRef<HTMLDivElement>(null)

  // Fade-in-fade-out effect on route change (together with CSS transition)
  useEffect(() => {
    // setIsVisible(false)
    const opacityTimer = setTimeout(() => {
      // setIsVisible(true)
      (divRef.current as HTMLDivElement)?.classList?.replace('opacity-0', 'opacity-100')
    }, 100)

    return () => clearTimeout(opacityTimer)
  })

  return /* loading ? <LoadText /> :  */(
    <div ref={divRef} className="transition-opacity delay-0 duration-700 opacity-0">
      <div data-theme={Theme[theme!]} className="m-0 sm:mx-auto p-2 sm:p-4 w-screen sm:max-w-160 max-sm:h-screen flex flex-col bg-content-bg rounded-xl">
        <header>
          <MainNav />
        </header>
        <main className="flex-1 p-4 sm:p-4 bg-main-content-bg rounded-xl overflow-y-auto">
          {children}
        </main>
        <footer>
          <Footer theme={theme} setTheme={setTheme} />
        </footer>
      </div>
    </div>
  )
}

export default Layout
