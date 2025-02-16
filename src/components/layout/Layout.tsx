import type { FC, JSX } from 'react'
import LoadText from '../shared/LoadText'
import MainNav from '../shared/MainNav'
import Footer from '../shared/Footer'
import { Theme } from '../../types/general.types'
import type { ILayout } from '../../types/general.types'

const Layout: FC<ILayout> = ({ loading, theme, setTheme, children }): JSX.Element => {

  return loading ? <LoadText /> : (
    <div data-theme={Theme[theme!]} className="m-0 sm:mx-auto p-2 sm:p-4 w-screen sm:max-w-160 max-sm:h-screen flex flex-col bg-content-bg rounded-xl">
      <header>
        <MainNav />
      </header>
      <main className="flex-1 p-2 sm:p-4 bg-main-content-bg rounded-xl overflow-y-auto">
        {children}
      </main>
      <footer>
        <Footer theme={theme} setTheme={setTheme} />
      </footer>
    </div>
  )
}

export default Layout
