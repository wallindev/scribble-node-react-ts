import { Navigate, Outlet } from 'react-router-dom'
import type { FC, JSX } from 'react'
import { isAuthenticated } from '../utils/functions'

const ProtectedRoute: FC = (): JSX.Element => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />
  }
  return <Outlet />
}

export default ProtectedRoute
