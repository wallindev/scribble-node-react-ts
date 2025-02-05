import { FC, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

const Logout: FC = () => {  // Explicitly typed as a functional component
  const navigate = useNavigate()

  const handleLogout = (event: MouseEvent<HTMLButtonElement>) => { // Type for event handler
    event.preventDefault() // Prevent default form submission behavior (if wrapped in a form)
    localStorage.removeItem('isAuthenticated')
    navigate('/')
  }

  return (
    <button onClick={handleLogout}>Logout</button>
  )
}

export default Logout
