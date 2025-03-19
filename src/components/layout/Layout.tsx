import { useEffect, useState } from 'react'
import type { FC, JSX } from 'react'
// import LoadText from '../shared/LoadText'
import MainNav from '../shared/MainNav'
import Footer from '../shared/Footer'
import { Theme } from '../../types/general.types'
import { FADE_IN_TIME, FADE_OUT_TIME } from '../../utils/constants'
import type { ILayout } from '../../types/general.types'

const Layout: FC<ILayout> = ({ /* loading,  */theme, setTheme, wrapperRef, children }): JSX.Element => {
  const [subNavOpen, setSubNavOpen] = useState(false)

  // Fade-in effect on route change (together with CSS transition)
  useEffect(() => {
    const divWrapper = wrapperRef.current as HTMLDivElement

    // Initiate fade-in
    const fadeInTimer = setTimeout(() => {
      divWrapper.classList?.replace(`duration-${FADE_OUT_TIME}`, `duration-${FADE_IN_TIME}`)
      divWrapper.classList?.replace('opacity-0', 'opacity-100')
    }, 100)

    return () => {
      clearTimeout(fadeInTimer)
    }
  }, [])

  return /* loading ? <LoadText /> :  */(
    <div ref={wrapperRef} className={`transition-all delay-0 duration-${FADE_IN_TIME} opacity-0`} onClick={() => setSubNavOpen!(false)} data-theme={Theme[theme!]}>
      <div className="m-0 sm:mx-auto p-2 sm:p-4 w-screen sm:max-w-160 max-sm:h-screen flex flex-col bg-content-bg rounded-xl">
        <header>
          <MainNav wrapperRef={wrapperRef} subNavOpen={subNavOpen} setSubNavOpen={setSubNavOpen} />
        </header>
        <main className="outline-0 flex-1 p-4 sm:p-4 bg-main-content-bg rounded-xl overflow-y-auto">
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
