import { useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import type { FC, JSX, MouseEvent } from 'react'
import { LinkType } from '../../types/general.types'
import CustomButton from './CustomButton'
import TextLink from './TextLink'
import { FADE_OUT_TIME } from '../../utils/constants'
import type { IDelayedLink } from '../../types/general.types'
import { LINK_TRANSITION_DURATION } from '../../utils/constants'

const DelayedLink: FC<IDelayedLink> = ({ wrapperRef, linkType = LinkType.Nav, delay = FADE_OUT_TIME, onClick, to, buttonType = 'button', children, className, size = 'large', style, ...props }): JSX.Element => {
  const navigate = useNavigate()
  const navLinkRef = useRef<HTMLAnchorElement>(null)

  let cssClasses: string = ''
  if (className) cssClasses = classNames(className, cssClasses)
  cssClasses = classNames('outline-0', cssClasses)

  useEffect(() => {
    if (linkType === LinkType.Nav && navLinkRef.current) {
      const curNavLink = navLinkRef.current as HTMLAnchorElement
      curNavLink.classList.add('transition-colors', `duration-${LINK_TRANSITION_DURATION}`, 'hover:text-text-hover', 'focus-visible:text-text-hover')

      if (curNavLink.classList.contains('active')) curNavLink.classList.add('font-bold', 'pointer-events-none', 'select-none')
    }
  }, [])

  const handleNavigate = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>): void => {
    e.preventDefault()

    // NavLink
    if (linkType === LinkType.Nav) {
      const curNavLink = navLinkRef.current as HTMLAnchorElement
      if (curNavLink.classList.contains('active')) return
    }

    if (onClick) {
      // console.log('DelayedLink, onClick:', onClick)
      onClick(e as MouseEvent<HTMLButtonElement>)
    }

    setTimeout(() => {
      const divWrapper = wrapperRef.current as HTMLDivElement
      divWrapper.classList.replace('opacity-100', 'opacity-0')
    }, 10)

    // Navigate after the fade-out is finished
    setTimeout(() => {
      // console.log(`Navigating to '${to}'...`)
      navigate(to)
    }, delay)
  }

  if (linkType === LinkType.Text) {
    return <TextLink className={cssClasses} to={to} onClick={handleNavigate} {...props}>{children}</TextLink>
  } else if (linkType === LinkType.Button) {
    return <CustomButton className={cssClasses} onClick={handleNavigate} type={buttonType} size={size} {...props}>{children}</CustomButton>
  } else {
    return <NavLink ref={navLinkRef} className={cssClasses} to={to} end onClick={handleNavigate} {...props}>{children}</NavLink>
  }
}

export default DelayedLink
