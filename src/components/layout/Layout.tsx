import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { FC, JSX } from 'react'
import LoadText from '../shared/LoadText'
import MainNav from '../shared/MainNav'
import Footer from '../shared/Footer'
import { Theme } from '../../types/general.types'
import type { ILayout } from '../../types/general.types'

const Layout: FC<ILayout> = ({ loading, theme, setTheme, children }): JSX.Element => {
  const [isVisible, setIsVisible] = useState(true)
  const location = useLocation()

  // Fade-in-fade-out effect on route change (together with CSS transition)
  useEffect(() => {
    setIsVisible(false)
    const timeoutId = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [location.key])

  return loading ? <LoadText /> : (
    <div style={{ transition: 'opacity 0.100s ease-in-out', opacity: isVisible ? 1 : 0 }}>
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
