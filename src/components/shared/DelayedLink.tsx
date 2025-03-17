import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import type { FC, JSX, MouseEvent } from 'react'
import { LinkType } from '../../types/general.types'
import CustomButton from './CustomButton'
import TextLink from './TextLink'
import { FADE_IN_TIME, FADE_OUT_TIME } from '../../utils/constants'
import { avoidStupidTailwindDuplicationAtLeastInSourceCode } from '../../utils/functions'
import type { IDelayedLink } from '../../types/general.types'

const DelayedLink: FC<IDelayedLink> = ({ wrapperRef, linkType = LinkType.Nav, delay = FADE_OUT_TIME, onClick, to, buttonType, children, className, size = 'large', style, ...props }): JSX.Element => {
  const [navLinkIsActive, setNavLinkIsActive] = useState<boolean>(false)
  const navigate = useNavigate()
  const navLinkRef = useRef<HTMLAnchorElement>(null)

  // console.log('css classes from start:', className)

  useEffect(() => {
    if (navLinkRef.current && linkType === LinkType.Nav) {
      const curNavLink = navLinkRef.current as HTMLAnchorElement
      const curNavLinkName: string = curNavLink.innerHTML
      // console.log('current navlink:', curNavLinkName)
      // console.log('current navlink\'s css classes:', curNavLink.classList)

      if (curNavLink.classList.contains('active')) {
        console.log(`'${curNavLinkName}' is active! and shouldn't be clickable =)`)
        // setNavLinkIsActive(true)
      }
    }
  }, [])

  const handleNavigate = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    // If NavLink is active, do nothing
    if (navLinkIsActive) return

    // Initiate fade-out effect on wrapper div
    const divWrapper = wrapperRef.current as HTMLDivElement
    divWrapper.classList?.replace(`duration-${FADE_IN_TIME}`, `duration-${FADE_OUT_TIME}`)
    divWrapper.classList?.replace('opacity-100', 'opacity-0')

    // Navigate after the fade-out is finished
    setTimeout(() => {
      navigate(to)
    }, delay)
  }

  // class="focus-visible:text-text-hover"
  // {() => avoidStupidTailwindDuplicationAtLeastInSourceCode(['active', 'hover', 'focus', 'focus-visible'], ['bg-button-bg-hover', 'text-text-hover'])}
  // {() => avoidStupidTailwindDuplicationAtLeastInSourceCode(['active', 'hover', 'focus', 'focus-visible'], ['bg-button-bg-hover', 'text-text-hover'])}
  // {() => avoidStupidTailwindDuplicationAtLeastInSourceCode(['active', 'hover', 'focus', 'focus-visible'], ['bg-button-bg-hover', 'text-text-hover'])}

  // const tailwindClasses = 'hover:bg-button-bg-hover hover:text-text-hover'
  // const tailwindClassesFunc = () => 'hover:bg-button-bg-hover hover:text-text-hover focus-visible:bg-button-bg-hover focus-visible:text-text-hover'
  // cssClassesString: hover:bg-button-bg-hover hover:text-text-hover focus-visible:bg-button-bg-hover focus-visible:text-text-hover
  // cssClassesString: hover:bg-button-bg-hover hover:text-text-hover focus-visible:bg-button-bg-hover focus-visible:text-text-hover
  // cssClassesString: active:bg-button-bg-hover active:text-text-hover hover:bg-button-bg-hover hover:text-text-hover focus-visible:bg-button-bg-hover focus-visible:text-text-hover
  // cssClassesString: active:bg-button-bg-hover active:text-text-hover hover:bg-button-bg-hover hover:text-text-hover focus:bg-button-bg-hover focus:text-text-hover focus-visible:bg-button-bg-hover focus-visible:text-text-hover
  if (linkType === LinkType.Text) {
    return <TextLink className={classNames('outline-0', className)} to={to} {...props}>{children}</TextLink>
  } else if (linkType === LinkType.Button) {
    return <CustomButton className={classNames('outline-0', className)} to={to} type={buttonType} onClick={onClick}>{children}</CustomButton>
  } else {
    return <NavLink ref={navLinkRef} className={classNames('outline-0', className)} to={to} onClick={handleNavigate} {...props}>{children}</NavLink>
  }
}

export default DelayedLink
