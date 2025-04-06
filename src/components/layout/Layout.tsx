import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FC, JSX } from 'react'
// import LoadText from '../shared/LoadText'
import MainNav from '../shared/MainNav'
import FlashMessage from '../shared/FlashMessage'
import Footer from '../shared/Footer'
import { Theme } from '../../types/general.types'
import type { ILayout } from '../../types/general.types'
import { hideFlashMessage } from '../../utils/functions'

const Layout: FC<ILayout> = ({ /* loading,  */theme, setTheme, flashMessage, setFlashMessage, wrapperRef, children }): JSX.Element => {
  const [searchParams, _setSearchParams] = useSearchParams()
  const [subNavOpen, setSubNavOpen] = useState(false)

  // Fade-in effect on route change (together with CSS transition)
  // console.log('searchParams:', searchParams)
  useEffect(() => {
    // Remove flash message on every reload
    hideFlashMessage(flashMessage, setFlashMessage)
    // console.log('useEffect in Layout fired')
    const fadeInTimer = setTimeout(() => {
      // console.log('show wrapper/page')
      const divWrapper = wrapperRef.current as HTMLDivElement
      divWrapper.classList.replace('opacity-0', 'opacity-100')
    }, 100)

    return () => {
      clearTimeout(fadeInTimer)
    }
  }, [searchParams])

  return /* loading ? <LoadText /> : */ (
    <div ref={wrapperRef} className={`transition-all delay-0 duration-1000 opacity-0`} onClick={() => setSubNavOpen!(false)} data-theme={Theme[theme!]}>
      <div className="m-0 sm:mx-auto p-2 sm:p-4 w-screen sm:max-w-160 max-sm:h-screen flex flex-col bg-content-bg rounded-xl">
        <header>
          <MainNav wrapperRef={wrapperRef} flashMessage={flashMessage} setFlashMessage={setFlashMessage} subNavOpen={subNavOpen} setSubNavOpen={setSubNavOpen} />
        </header>
        <main className="outline-0 flex-1 p-4 sm:p-4 bg-main-content-bg rounded-xl overflow-y-auto">
          <FlashMessage flashMessage={flashMessage} setFlashMessage={setFlashMessage} />
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
