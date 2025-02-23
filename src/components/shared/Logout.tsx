import { useNavigate } from 'react-router-dom'
import type { FC, JSX, MouseEvent } from 'react'
import CustomButton from './CustomButton'
import { logout } from '../../utils/functions'
import type { ILogout } from '../../types/form.types'

const Logout: FC<ILogout> = ({ size = 'large', ...props }): JSX.Element => {
  const navigate = useNavigate()

  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    logout()
    navigate('/')
  }

  return (
    <CustomButton onClick={handleLogout} size={size} {...props}>Logout</CustomButton>
  )
}

export default Logout
