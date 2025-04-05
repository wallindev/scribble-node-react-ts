import type { FC, JSX, MouseEvent, RefObject } from 'react'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import CustomButton from './CustomButton'
import { fadeOutAndNavigate, logout } from '../../utils/functions'
import { STANDARD_DELAY } from '../../utils/constants'
import type { ILogout } from '../../types/form.types'

const Logout: FC<ILogout> = ({  wrapperRef, flashMessage, setFlashMessage, className, size = 'large', ...props }): JSX.Element => {
  const navigate = useNavigate()
  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setFlashMessage({
      message: 'Logging out...',
      type: 'success',
      visible: true,
    })
    setTimeout(() => {
      logout()
    }, STANDARD_DELAY)
    // Initiate fade-out effect on wrapper div
    fadeOutAndNavigate(wrapperRef as RefObject<HTMLDivElement>, '/', navigate, STANDARD_DELAY, flashMessage, setFlashMessage)
  }

  return (
    <CustomButton className={classNames('outline-0', className)} onClick={handleLogout} size={size} {...props}>Logout</CustomButton>
  )
}

export default Logout
