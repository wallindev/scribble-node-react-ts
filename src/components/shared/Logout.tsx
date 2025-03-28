import classNames from 'classnames'
import type { FC, JSX, MouseEvent } from 'react'
import DelayedLink from './DelayedLink'
import { logout } from '../../utils/functions'
import type { ILogout } from '../../types/form.types'
import { LinkType } from '../../types/general.types'

const Logout: FC<ILogout> = ({  wrapperRef, className, size = 'large', ...props }): JSX.Element => {
  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    logout()
  }

  return (
    <DelayedLink buttonType="button" wrapperRef={wrapperRef} linkType={LinkType.Button} className={classNames('outline-0', className)} to="/" onClick={handleLogout} size={size} {...props}>Logout</DelayedLink>
  )
}

export default Logout
