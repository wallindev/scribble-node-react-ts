import { useNavigate } from 'react-router-dom'
import type { FC, JSX, MouseEvent } from 'react'
import CustomButton from './CustomButton'
import { setAuth } from '../../utils/functions'

const Logout: FC = (): JSX.Element => {
  const navigate = useNavigate()

  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setAuth(false)
    navigate('/')
  }

  return (
    <CustomButton onClick={handleLogout}>Logout</CustomButton>
  )
}

export default Logout
